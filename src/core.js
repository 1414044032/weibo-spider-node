const puppeteer = require('puppeteer');
const log4js = require('log4js');
const cheerio = require('cheerio');
let fs = require("fs");
let config = require("./config");

let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';

class Core {
    constructor(headless) {
        this.browser = null;
        this.page = null;
        // 是否隐藏浏览器界面
        this.headless = headless;
        return (async () => {
            this.browser = await puppeteer.launch({headless: this.headless});
            this.page = await this.browser.newPage();
            return this
        })()
    }
}

module.exports = new Core(config.headless);


