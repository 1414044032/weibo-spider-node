const puppeteer = require('puppeteer');
const log4js = require('log4js');
const cheerio = require('cheerio')
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';
// 登录标记
let loginStatus = false;
// 重试标记
let loginRetryCounts = 0
// 是否隐藏浏览器界面
let headless = false
// 用户名
let username = '18404975197'
// 密码
let password = ''

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
    await page.screenshot({path: 'example.png'});
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
}

async function close_browser(browser) {
    logger.debug("关闭浏览器");
    await browser.close();
}

// 检查登录状态
async function check_login(page) {
    return await page.$('.gn_login_list .S_txt1');

}

// 登录帐号
async function login_weibo(page) {
    // 登录操作
    logger.debug("输入用户名密码");
    let buttom = await page.waitForSelector('.gn_login_list a[node-type=loginBtn]')
    await buttom.click()
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
    return await page.waitForXPath('//div[@class="gn_set_list"]').then(()=>{
        logger.debug("登录成功");
        return true
    }).catch(() => {
        logger.debug("登录失败");
        return false
    })
}

async function main() {
    logger.debug("主函数运行");
    const browser = await open_browser();
    const page = await open_page(browser);
    await goto_url(page, 'https://s.weibo.com/?Refer=');
    await page.waitFor(2000);
    const text = await check_login(page);
    if (!!text) {
        logger.debug("未登录");
        while (!loginStatus){
            loginRetryCounts ++;
            if (loginRetryCounts <3){
                loginStatus = await login_weibo(page)
            }
        }
        logger.debug("已登录")
        await search_keyword(page,'范冰冰')
        await extract_info(page)
        await close_browser(browser)
    } else {
        logger.debug("已登录")
    //    ....
    }


}

main();
