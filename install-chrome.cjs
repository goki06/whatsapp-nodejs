const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        // Chromium-Installation erzwingen
        await puppeteer.createBrowserFetcher().download('1273080');  // Version 127.0.6533.88

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        console.log('Chromium erfolgreich gestartet unter:', browser.executablePath());
        await browser.close();
    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
