const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        // BrowserFetcher verwenden, um Chromium manuell herunterzuladen
        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download('1108766');

        console.log(`Chromium heruntergeladen: ${revisionInfo.executablePath}`);

        // Speichere den Pfad in einer Datei für spätere Verwendung
        fs.writeFileSync('.chromium-path', revisionInfo.executablePath);

        console.log('Chromium wurde erfolgreich installiert.');
        process.exit(0);

    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
