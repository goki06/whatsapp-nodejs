const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();
        
        const browser = await puppeteer.launch({
            executablePath: executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('Chromium erfolgreich gestartet unter:', executablePath);
        await browser.close();
    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }
})();
