const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const page1 = await browser.newPage();
    const page2 = await browser.newPage();
    await page.goto('http://www.baidu.com');
    await page1.goto('http://www.baidu.com');
    await page2.goto('http://www.baidu.com');
    await page.screenshot({path: 'example.png'});

    await browser.close();
})();
