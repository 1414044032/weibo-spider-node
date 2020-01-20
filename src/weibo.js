let config = require("./config");
let core = require('./core');
const log4js = require('log4js');
const cheerio = require('cheerio');
const fs = require("fs");
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';

class Weibo {
    constructor(username, password, start_url, type = 'search', total = 1000) {
        // 用户名
        this.username = username;
        // 密码
        this.password = password;
        // 浏览器对象
        this.core = null;
        // 登录标记
        this.loginStatusC = false;
        // 登录标记C
        this.loginStatusN = false;// 重试标记
        this.loginRetryCounts = 0;
        this.start_url = start_url;
        this.total = total;
        this.current_page = 0;
        this.type = type;
        this.login_status = false;
        return (async () => {
            this.core = await core;
            return this
        })()
    }

    // 保存cookies
    save_cookies(cookies_list) {
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
    read_cookies() {
        if (fs.existsSync('./cookies.txt')) return fs.readFileSync('./cookies.txt', 'utf-8');
        return null;
    }

    async set_cookies(cookies_list) {
        await this.core.page.setCookie(...JSON.parse(cookies_list));
    }

    async goto_url(url) {
        logger.debug("打开网页");
        await this.core.page.goto(url);
    }

    // cookies登录帐号
    async _login_weibo_cookies() {
        // 登录操作 1，通过cookie登录，失败后再通过用户名密码登录。用户名密码登录成功后保存最新cookie
        let cookies = this.read_cookies();
        if (cookies) {
            logger.debug("cookie登录");
            await this.set_cookies(cookies);
            await this.goto_url(this.start_url)
        } else {
            logger.debug("cookie不存在");
        }
        //判断是否完成登录
        return await this.core.page.waitForXPath('//div[@class="gn_set_list"]').then(() => {
            logger.debug("登录成功");
            return true
        }).catch(() => {
            logger.debug("登录失败");
            return false
        })
    }

    async _login_weibo_username() {
        logger.debug("用户名密码登录");
        let buttom = await this.core.page.waitForSelector('.gn_login_list a[node-type=loginBtn]')
        await buttom.click();
        let userLogin = await this.core.page.waitForXPath('//*[@node-type="username"]');
        await userLogin.focus();
        await this.core.page.keyboard.sendCharacter(this.username);
        let passwordLogin = await this.core.page.waitForXPath('//*[@node-type="password"]');
        await passwordLogin.focus();
        await this.core.page.keyboard.sendCharacter(this.password);
        let loginBtn = await this.core.page.waitForXPath('//*[@node-type="submitBtn"][1]');
        await loginBtn.click()
        logger.debug("登录ing");
        //判断是否完成登录
        return await this.core.page.waitForXPath('//div[@class="gn_set_list"]').then(() => {
            logger.debug("登录成功");
            return true
        }).catch(() => {
            logger.debug("登录失败");
            return false
        })
    }

    // 检查登录状态
    async _check_login() {
        let loginBtn = this.core.page.waitForSelector('.gn_login_list .S_txt1').then(() => {
            logger.debug("检测到未登录标记");
            return true
        }).catch(() => {
            logger.debug("未检测到未登录标记");
            return false
        })
        return await loginBtn;

    }

    // 登录
    async login() {
        await this.goto_url('https://s.weibo.com')
        const text = await this._check_login();
        let tempTag = false;
        if (!!text) {
            logger.debug("未登录");
            while (!this.loginStatusC && !this.loginStatusN) {
                this.loginRetryCounts++;
                if (this.loginRetryCounts < 3) {
                    // cookies 登录 ，失败后用户名登录，重试3次，全部失败后，退出程序
                    this.loginStatusC = await this._login_weibo_cookies();
                    if (!this.loginStatusC) this.loginStatusN = await this._login_weibo_username();
                    if (this.loginStatusC || this.loginStatusN) {
                        this.core.page.cookies().then(cookies => {
                            this.save_cookies(cookies)
                        }).catch(error => {
                            logger.debug("登录成功后获取cookies失败")
                        })
                        this.login_status = true;
                        tempTag = true;
                    }
                } else {
                    logger.debug("登录失败");
                }
            }
        } else {
            logger.debug("已登录");
            this.login_status = true;
            tempTag = true;
            //    ....
        }
        return tempTag
    }

    // 搜索点击逻辑相同
    async _search_keyword(keyword, type = null) {
        logger.debug(`输入${keyword}进行搜索`);
        await this.core.page.focus('.search-input>input');
        // await this.core.page.$eval('',input => input.value=keyword);
        await this.core.page.keyboard.sendCharacter(keyword);
        if (type){
            let typeBtn = await this.core.page.waitForXPath(`//a[@action-data="type=${type}"]`);
            typeBtn.click();
        }
        await this.core.page.click('.s-btn-b')
        // await this.core.page.screenshot({path: 'example.png'});
    }

    // 提取搜索综合信息
    async _extract_info() {
        // 提取信息块
        this.current_page++
        if (this.current_page <= this.total) {
            logger.debug(`当前第${this.current_page}页`);
            const divs = await this.core.page.$$eval('.card-wrap', divs => {
                return divs.map(div => {
                    return div.outerHTML
                })
            });
            // 解析信息 ***** 正文解析html，对标题正文都解析不到的抛弃
            for (let item of divs) {
                let $ = cheerio.load(item, {decodeEntities: false});
                let mid = $('.card-wrap').attr('mid');
                let tag = $('.card-top h4 a').text();
                let title = $('.card>.card-feed>.content>.info>div>a[class=name]').text();
                let content = $('.card>.card-feed>.content>p[node-type=feed_list_content_full]').html() || $('.card>.card-feed>.content>p[node-type=feed_list_content]').html();
                let comment = $('.card>.card-act li:nth-last-child(2)').text();
                let like = $('.card>.card-act li:nth-last-child(1)').text();
                let share = $('.card>.card-act li:nth-last-child(3)').text();
                // 获取到内容进行的处理
                if (!!title && !!content) console.debug(mid, tag, title, content, comment, like, share)
            }

            // 下一页
            let nextPage = await this.core.page.waitForXPath('//a[@class="next"]');
            await Promise.all([
                nextPage.click(),
                this.core.page.waitForNavigation()
            ]);
            await this._extract_info()
        } else {
            this.core.browser.close();
            process.exit()
        }
    }

    // 提取搜索找人信息
    async _extract_user() {
        // 提取信息块
        this.current_page++
        if (this.current_page <= this.total) {
            logger.debug(`当前第${this.current_page}页`);
            const divs = await this.core.page.$$eval('#pl_user_feedList >div', divs => {
                return divs.map(div => {
                    return div.outerHTML
                })
            });
            // 解析信息 ***** 用户信息解析
            for (let item of divs) {
                let $ = cheerio.load(item, {decodeEntities: false});
                let avator = $('.avator img').attr('src');
                let username = $('.info>div>a:nth-child(1)').html();
                let user_info = $('.info>p:nth-child(1)').html();
                let user_other = $('.info>p:nth-child(2)').html();
                let user_desc = $('.info>p:nth-child(3)').text();
                let user_tag = $('.info>p:nth-child(4)').html();
                let user_edu = $('.info>p:nth-child(5)').html();
                let user_com = $('.info>p:nth-child(6)').html();
                // 获取到内容进行的处理
                console.debug(username, user_info, user_desc, user_tag, user_edu, user_com)
            }

            // 下一页
            let nextPage = await this.core.page.waitForXPath('//a[@class="next"]');
            await Promise.all([
                nextPage.click(),
                this.core.page.waitForNavigation()
            ]);
            await this._extract_user()
        } else {
            this.core.browser.close();
            process.exit()
        }
    }

    // 提取搜索文章信息
    async _extract_article() {
        // 提取信息块
        this.current_page++
        if (this.current_page <= this.total) {
            logger.debug(`当前第${this.current_page}页`);
            const divs = await this.core.page.$$eval('.card-wrap', divs => {
                return divs.map(div => {
                    return div.outerHTML
                })
            });
            // 解析信息 ***** 文章信息解析
            for (let item of divs) {
                let $ = cheerio.load(item, {decodeEntities: false});
                let title = $('h3>a').html();
                let uri = $('h3>a').attr('href');
                let pic = $('.pic img').attr('src');
                // 消息摘要
                let content = $('.detail>.txt').html();
                // 来源
                let author = $('.act>div>span:nth-child(1)').html();
                // 时间
                let create_time = $('.act>div>span:nth-child(2)').text();
                // 其他信息
                let info_other = $('.act>ul').text();
                // 获取到内容进行的处理
                console.debug(title, uri, pic, content, author, create_time, info_other)
            }

            // 下一页
            let nextPage = await this.core.page.waitForXPath('//a[@class="next"]');
            await Promise.all([
                nextPage.click(),
                this.core.page.waitForNavigation()
            ]);
            await this._extract_article()
        } else {
            this.core.browser.close();
            process.exit()
        }
    }

    //滚动到底
    async _autoScroll() {
        return this.core.page.evaluate(() => {
            return new Promise((resolve, reject) => {
                //滚动的总高度
                let totalHeight = 0;
                //每次向下滚动的高度 100 px
                let distance = 500;
                let timer = setInterval(() => {
                    //页面的高度 包含滚动高度
                    let scrollHeight = document.body.scrollHeight;
                    //滚动条向下滚动 distance
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    //当滚动的总高度 大于 页面高度 说明滚到底了。也就是说到滚动条滚到底时，以上还会继续累加，直到超过页面高度
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 200);
            })
        });
    }
    //提取用户所有微博
    async _extract_user_detail(){
        // 提取信息块
        this.current_page++
        if (this.current_page <= this.total) {
            logger.debug(`当前第${this.current_page}页`);
            // 滚动到底
            await this._autoScroll();
            const divs = await this.core.page.$$eval('div[action-type=feed_list_item]', divs => {
                return divs.map(div => {
                    return div.outerHTML
                })
            });
            // 解析信息 ***** 微博信息解析
            for (let item of divs) {
                let $ = cheerio.load(item, {decodeEntities: false});
                console.debug($('div').attr('class', 'WB_cardwrap').attr('class', 'WB_feed_like').html())
                let mid = $('div').attr('class', 'WB_cardwrap').attr('class', 'WB_feed_like').attr('mid')
                let content= $('div').attr('node-type','feed_list_content').html();
                let other_info=$('.WB_row_line').attr('class','WB_row_r4').html();
                // 获取到内容进行的处理
                console.debug(mid, content, other_info)
            }

            // 下一页page next S_txt1 S_line1
            let nextPage = await this.core.page.waitForXPath('//a[contains(@class,"page") and contains(@class,"next") ' +
                'and contains(@class,"S_txt1") and contains(@class,"S_line1")]',{hidden :true});
            if(nextPage){
                await Promise.all([
                    nextPage.click(),
                    this.core.page.waitForNavigation()
                ]);
                await this._extract_user_detail()
            }else {
                this.core.browser.close();
                process.exit()
            }
        } else {
            this.core.browser.close();
            process.exit()
        }
    }

    // 关键词搜索爬取
    async keyword_search(keyword, total = 0) {
        if (total) this.total = total
        await this._search_keyword(keyword);
        await this._extract_info();
    }

    // 用户搜索爬取
    async user_search(keyword, total = 0) {
        if (total) this.total = total
        //进入找人搜索页
        await this._search_keyword(keyword,'user');
        await this._extract_user();
    }

    // 文章搜索爬取
    async article_search(keyword, total = 0) {
        if (total) this.total = total
        //进入文章搜索页
        await this._search_keyword(keyword,'article');
        await this._extract_article();
    }

    // 用户微博爬取
    async user_detail(uri, total = 0) {
        if (total) this.total = total
        //进入文章搜索页
        await this.goto_url(uri);
        await this._extract_user_detail();
    }
}


module.exports = new Weibo(config.username, config.password, 'https://s.weibo.com', 'search', 10)

