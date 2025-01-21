const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');
        
        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download(puppeteer.browserRevision());
        
        console.log('Chromium erfolgreich installiert:', revisionInfo.executablePath);

        process.exit(0);

    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
