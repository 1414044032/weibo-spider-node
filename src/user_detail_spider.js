let weibo = require('./weibo');
const log4js = require('log4js');
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';
async function search_user() {
    logger.debug("用户所有微博爬取");
    let weibo1 = await weibo
    // 启动登录
    let login_status = await weibo1.login();
    // 登录成功后爬取
    if (login_status) {
        await weibo1.user_detail('https://weibo.com/u/5299349643',3);
    }
}

search_user()
