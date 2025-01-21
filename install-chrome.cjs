const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        // Verwende Umgebungsvariable für den Chromium-Pfad
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/opt/render/project/.cache/puppeteer/chrome/linux-1108766/chrome-linux/chrome',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Chromium wurde erfolgreich installiert unter:', browser.executablePath());
        await browser.close();
    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
