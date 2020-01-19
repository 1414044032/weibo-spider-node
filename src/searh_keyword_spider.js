let weibo = require('./weibo');
const log4js = require('log4js');
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';
async function search_keyword() {
    logger.debug("关键词查找");
    let weibo1 = await weibo
    // 启动登录
    let login_status = await weibo1.login();
    // 登录成功后爬取
    if (login_status) {
        // 爬取关键词，页数限制
        await weibo1.keyword_search('范冰冰',5);
    }
}

search_keyword()
