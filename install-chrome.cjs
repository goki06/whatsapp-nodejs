const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        // Definiere den Pfad zu Chromium, falls vorhanden
        const executablePath = process.env.CHROME_BIN || '/usr/bin/chromium-browser';

        const browser = await puppeteer.launch({
            executablePath: executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

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
