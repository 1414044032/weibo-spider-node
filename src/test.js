let weibo = require('./weibo');
const log4js = require('log4js');
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';
async function main() {
    logger.debug("主函数运行");
    let weibo = await weibo
    let login_status = await weibo.login();
    if (login_status) {
        console.log("登录成功")
        weibo.core.browser.close();
    }
}

main()
