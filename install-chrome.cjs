const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        const executablePath = process.env.CHROME_BIN || '/usr/bin/chromium-browser';

        const browser = await puppeteer.launch({
            executablePath: executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Chromium erfolgreich gestartet unter:', browser.executablePath());
        await browser.close();
    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
