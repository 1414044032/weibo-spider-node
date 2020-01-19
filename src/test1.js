const puppeteer = require('puppeteer');
const log4js = require('log4js');
const cheerio = require('cheerio');
var fs = require("fs");
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';
// 登录标记
let loginStatusC = false;
// 登录标记C
let loginStatusN = false;
// 重试标记
let loginRetryCounts = 0
// 是否隐藏浏览器界面
let headless = false
// 用户名
let username = '18404975197'
// 密码
let password = 'w0776867106'

// 'https://s.weibo.com/?Refer='
async function open_browser() {
    logger.debug("打开浏览器");
    return await puppeteer.launch({headless: false});
}

async function open_page(browser) {
    return await browser.newPage();
}

async function goto_url(page, url) {
    logger.debug("打开网页");
    await page.goto(url);
}

async function search_keyword(page, keyword) {
    logger.debug("查询关键词");
    await page.focus('.search-input>input');
    await page.keyboard.sendCharacter(keyword);
    await page.click('.s-btn-b')
    // await page.screenshot({path: 'example.png'});
}

// 提取
async function extract_info(page) {
    // 提取信息块
    const divs = await page.$$eval('.card-wrap', divs => {
        return divs.map(div => {
            return div.outerHTML
        })
    });
    // 解析信息 ***** 正文解析html，对标题正文都解析不到的抛弃
    for (let item of divs) {
        let $ = cheerio.load(item, {decodeEntities: false});
        let tag = $('.card-top h4 a').text();
        let title = $('.card>.card-feed>.content>.info>div>a[class=name]').text();
        let content = $('.card>.card-feed>.content>p[node-type=feed_list_content_full]').html() || $('.card>.card-feed>.content>p[node-type=feed_list_content]').html();
        let comment = $('.card>.card-act li:nth-last-child(2)').text();
        let like = $('.card>.card-act li:nth-last-child(1)').text();
        let share = $('.card>.card-act li:nth-last-child(3)').text();
        if (!!title && !!content) console.debug(tag, title, content, comment, like, share)
    }

    // 下一页
    let nextPage = await page.waitForXPath('//a[@class="next"]');
    await Promise.all([
        nextPage.click(),
        page.waitForNavigation()
    ]);
    await extract_info(page)
}

async function close_browser(browser) {
    logger.debug("关闭浏览器");
    await browser.close();
}

// 检查登录状态
async function check_login() {
    let loginBtn = this.core.page.waitForSelector('.gn_login_list .S_txt1').then(() => {
        logger.debug("检测到未登录标记");
        return true
    }).catch(() => {
        logger.debug("未检测到未登录标记");
        return false
    })
    return await loginBtn;

}

// 保存cookies
function save_cookies(cookies_list) {
    let json_str = JSON.stringify(cookies_list)
    fs.writeFile('./cookies.txt', json_str, {flag: 'w', encoding: 'utf-8'}, (error) => {
        if (error) {
            logger.debug('cookies保存失败')
        } else {
            logger.debug('cookies保存成功')
        }
    })
}

// 读取cookies
function read_cookies() {
    if (fs.existsSync('./cookies.txt')) return fs.readFileSync('./cookies.txt', 'utf-8');
    return null;
}

async function set_cookies(page, cookies_list) {
    await page.setCookie(...JSON.parse(cookies_list));
}

// cookies登录帐号
async function login_weibo_cookies(page) {
    // 登录操作 1，通过cookie登录，失败后再通过用户名密码登录。用户名密码登录成功后保存最新cookie
    let cookies = read_cookies();
    if (cookies) {
        logger.debug("cookie登录");
        await set_cookies(page, cookies);
        await goto_url(page, 'https://s.weibo.com/?Refer=')
    } else {
        logger.debug("cookie不存在");
    }
    //判断是否完成登录
    return await page.waitForXPath('//div[@class="gn_set_list"]').then(() => {
        logger.debug("登录成功");
        return true
    }).catch(() => {
        logger.debug("登录失败");
        return false
    })
}

async function login_weibo_username(page) {
    logger.debug("用户名密码登录");
    let buttom = await page.waitForSelector('.gn_login_list a[node-type=loginBtn]')
    await buttom.click();
    let userLogin = await page.waitForXPath('//*[@node-type="username"]');
    await userLogin.focus();
    await page.keyboard.sendCharacter(username);
    let passwordLogin = await page.waitForXPath('//*[@node-type="password"]');
    await passwordLogin.focus();
    await page.keyboard.sendCharacter(password);
    let loginBtn = await page.waitForXPath('//*[@node-type="submitBtn"][1]');
    await loginBtn.click()
    logger.debug("登录ing");
    //判断是否完成登录
    return await page.waitForXPath('//div[@class="gn_set_list"]').then(() => {
        logger.debug("登录成功");
        return true
    }).catch(() => {
        logger.debug("登录失败");
        return false
    })
}

// 登录
async function login(page) {
    const text = await check_login(page);
    let tempTag = false;
    if (!!text) {
        logger.debug("未登录");
        while (!loginStatusC && !loginStatusN) {
            loginRetryCounts++;
            if (loginRetryCounts < 3) {
                // cookies 登录 ，失败后用户名登录，重试3次，全部失败后，退出程序
                loginStatusC = await login_weibo_cookies(page);
                if (!loginStatusC) loginStatusN = await login_weibo_username(page);
                if (loginStatusC || loginStatusN) {
                    page.cookies().then(cookies => {
                        save_cookies(cookies)
                    }).catch(error => {
                        logger.debug("登录成功后获取cookies失败")
                    })
                    tempTag = true;
                }
            } else {
                logger.debug("登录失败");
            }
        }
    } else {
        logger.debug("已登录");
        tempTag = true;
        //    ....
    }
    return tempTag
}

async function test1() {
    logger.debug("主函数运行");
    const browser = await open_browser();
    const page = await open_page(browser);
    await goto_url(page, 'https://s.weibo.com/?Refer=');
    let login_status = await login(page);
    if (login_status) {
        await search_keyword(page, '范冰冰')
        await extract_info(page)
        await close_browser(browser)
    }
}

test1();
