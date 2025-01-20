const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

(async () => {
    console.log("Launching Chromium...");

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const client = new Client({
        puppeteer: {
            browserWSEndpoint: browser.wsEndpoint()
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

    app.get('/send', async (req, res) => {
        const { number, message } = req.query;
        if (!number || !message) {
            return res.status(400).send('Please provide number and message');
        }
        const chatId = number + "@c.us";
        try {
            await client.sendMessage(chatId, message);
            res.send(`Message sent to ${number}`);
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send("Failed to send message");
        }
    });

    await client.initialize();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
