const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Installing Chromium using Puppeteer...');
        
        // Chromium wird mit Puppeteer heruntergeladen und der Pfad abgerufen
        const browserFetcher = puppeteer.createBrowserFetcher();
        const revisionInfo = await browserFetcher.download(puppeteer.defaultArgs().find(arg => arg.startsWith('--remote-debugging-port')) ? 'chrome' : puppeteer.executablePath());
        
        console.log('Chromium installed successfully at:', revisionInfo.executablePath);
    } catch (error) {
        console.error('Error installing Chromium:', error);
        process.exit(1);
    }
})();
