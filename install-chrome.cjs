const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        // Lade Chromium mit Puppeteer herunter
        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download(puppeteer.PUPPETEER_REVISIONS.chromium);

        console.log('Chromium erfolgreich heruntergeladen:', revisionInfo.executablePath);

        console.log('Starte Chromium-Test...');
        const browser = await puppeteer.launch({
            executablePath: revisionInfo.executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Chromium läuft erfolgreich.');
        await browser.close();
        process.exit(0);

    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
