const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Installing Chromium using Puppeteer...');
        
        // Startet eine Browser-Instanz, wodurch Chromium heruntergeladen wird
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Chromium installed successfully at:', puppeteer.executablePath());

        await browser.close();
    } catch (error) {
        console.error('Error installing Chromium:', error);
        process.exit(1);
    }
})();
