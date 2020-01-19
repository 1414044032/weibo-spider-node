let config = require("./config");
let core = require('./core');
const log4js = require('log4js');
const fs = require("fs");
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';

class Weibo {
    constructor(username, password, start_url, type = 'search') {
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
        this.start_url = null;
        this.type = type;
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
        await this.goto_url('https://s.weibo.com/?Refer=')
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

}


module.exports = new Weibo(config.username, config.password, 'https://s.weibo.com/?Refer=', 'search')
