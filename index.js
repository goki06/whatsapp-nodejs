const express = require('express');
const puppeteer = require('puppeteer');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();

(async () => {
    try {
        console.log('Überprüfe die Chromium-Installation mit Puppeteer...');

        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
            headless: true,
            args: [
                '--no-sandbox',                // Wichtig für root-Benutzer
                '--disable-setuid-sandbox',    // Deaktiviert setuid Sandbox
                '--disable-gpu',               // GPU-Nutzung deaktivieren
                '--disable-dev-shm-usage',     // Shared Memory Nutzung deaktivieren
                '--no-zygote',                 // Sicherheitsprozess abschalten
                '--single-process'             // Multi-Prozess verhindern
            ]
        });

        console.log('Chromium erfolgreich gestartet unter:', browser.wsEndpoint());
        await browser.close();
    } catch (error) {
        console.error('Fehler bei der Chromium-Installation mit Puppeteer:', error);
        process.exit(1);
    }

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--no-zygote',
                '--single-process'
            ]
        }
    });

    client.on('qr', qr => {
        console.log('Scan this QR code:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('WhatsApp bot ist bereit!');
    });

    app.get('/send', async (req, res) => {
        const { number, message } = req.query;
        if (!number || !message) {
            return res.status(400).send('Bitte gib Nummer und Nachricht an');
        }
        const chatId = `${number}@c.us`;
        await client.sendMessage(chatId, message);
        res.send(`Nachricht an ${number} gesendet`);
    });

    await client.initialize();

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server läuft auf Port ' + (process.env.PORT || 3000));
    });
})();
