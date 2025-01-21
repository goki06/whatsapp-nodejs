const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        // Starte Puppeteer und lasse es den Chromium-Download verwalten
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const executablePath = browser.process().spawnargs[0];
        console.log(`Chromium wurde erfolgreich installiert: ${executablePath}`);

        // Speichere den Pfad in einer Datei für spätere Verwendung
        fs.writeFileSync('.chromium-path', executablePath);

        await browser.close();
        process.exit(0);
    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
