const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Installing Chromium...');
        const browser = await puppeteer.launch();
        console.log('Chromium installed successfully.');
        await browser.close();
    } catch (error) {
        console.error('Error installing Chromium:', error);
        process.exit(1);
    }
})();
