const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const app = express();

// Lese den gespeicherten Chromium-Pfad
const chromiumPath = fs.existsSync('.chromium-path')
    ? fs.readFileSync('.chromium-path', 'utf8').trim()
    : null;

if (!chromiumPath) {
    console.error('Chromium executable not found.');
    process.exit(1);
}

// Starte den Puppeteer-Client mit dem gespeicherten Chromium-Pfad
(async () => {
    try {
        console.log('Starte Puppeteer mit Chromium von:', chromiumPath);
        const client = new Client({
            puppeteer: {
                executablePath: chromiumPath,
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            authStrategy: new LocalAuth()
        });

        client.on('qr', qr => {
            console.log('Scan this QR code with your WhatsApp app:');
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('WhatsApp bot is ready!');
        });

        client.on('message', message => {
            console.log(`Received message: ${message.body}`);
        });

        await client.initialize();

        app.get('/send', async (req, res) => {
            const { number, message } = req.query;
            if (!number || !message) {
                return res.status(400).send('Please provide number and message');
            }
            const chatId = number + "@c.us";
            await client.sendMessage(chatId, message);
            res.send('Message sent to ' + number);
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error launching Puppeteer:', error);
        process.exit(1);
    }
})();
