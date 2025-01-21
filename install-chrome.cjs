const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');
        
        // Puppeteer verwendet seine eigene Chromium-Version
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        console.log('Chromium-Installation erfolgreich. Pfad:', browser.process().spawnfile);

        await browser.close();
        process.exit(0);

    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
