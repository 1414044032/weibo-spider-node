let weibo = require('./weibo');
const log4js = require('log4js');
let logger = log4js.getLogger();
// 日志级别
logger.level = 'debug';
async function search_article() {
    let weibo1 = await weibo
    // 启动登录
    let login_status = await weibo1.login();
    // 登录成功后爬取
    if (login_status) {
        // 爬取关键词，页数限制
        await weibo1.article_search('123',2);
    }
}

search_article()
