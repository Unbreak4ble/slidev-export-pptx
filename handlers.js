const { chromium } = require('playwright');
const puppeteer = require('puppeteer');

const slidev_url = "http://localhost:3030/2";
const colorScheme = "dark";
const viewport = { width: 1280, height: 720, deviceScaleFactor: 5 };

const playwrightHandler = async (callback) => {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    await page.emulateMedia({
        colorScheme: colorScheme
    });

    await page.setViewportSize(viewport);

    await page.goto(slidev_url, { waitUntil: 'load' });

    await page.waitForNavigation({ waitUntil: "networkidle" });

    const slideshow_selector = "#slideshow";
    let currentUrl = "."; // intentionally added '.' so it can diff from lastUrl in first comparison case.
    let lastUrl = "";

    await page.waitForSelector(slideshow_selector, { visible: true, timeout: 16000 });

    const slideshow_element = page.locator(slideshow_selector);

    while(true){
        lastUrl = currentUrl;

        const buffer = await slideshow_element.screenshot();

        currentUrl = await page.url();

        if(lastUrl == currentUrl) break;

        callback?.(buffer, currentUrl, lastUrl == currentUrl);

        await page.keyboard.press('ArrowRight', { delay: 1 });

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    await browser.close();
};

const puppeteerHandler = async (callback) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport(viewport);

    await page.goto(slidev_url, { waitUntil: 'load' });

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    const slideshow_selector = "#slideshow";
    let lastUrl = ".";
    let currentUrl = "";
    
    await page.waitForSelector(slideshow_selector, { visible: true, timeout: 16000 });

    const slideshow_element = await page.$(slideshow_selector);

    while(true){
        lastUrl = currentUrl;

        const buffer = await slideshow_element.screenshot();

        currentUrl = await page.url();

        if(lastUrl == currentUrl) break;

        callback?.(buffer, currentUrl, lastUrl == currentUrl);

        await page.keyboard.press('ArrowRight', { delay: 1 });

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    await browser.close();
};

module.exports = {
    playwrightHandler,
    puppeteerHandler
}