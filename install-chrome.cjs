const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Installing Chromium using Puppeteer...');

        // Chromium herunterladen und den installierten Pfad ausgeben
        const browser = await puppeteer.launch({ headless: true });
        console.log('Chromium installed successfully at:', browser.executablePath());
        await browser.close();
    } catch (error) {
        console.error('Error installing Chromium:', error);
        process.exit(1);
    }
})();
