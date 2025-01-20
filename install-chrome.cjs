const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Checking for Chromium installation...');

        const browser = await puppeteer.launch({
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Chromium is ready at:', browser.executablePath());
        await browser.close();
    } catch (error) {
        console.error('Error with Puppeteer Chromium:', error);
        process.exit(1);
    }
})();
