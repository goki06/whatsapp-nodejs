const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Installing Chromium using Puppeteer...');

        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download('1108766');  // Fixierte Revision von Chromium

        console.log('Chromium installed successfully at:', revisionInfo.executablePath);

    } catch (error) {
        console.error('Error installing Chromium:', error);
        process.exit(1);
    }
})();
