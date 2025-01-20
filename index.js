import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import express from 'express';
import puppeteer from 'puppeteer-core';

const app = express();

(async () => {
    console.log("Launching Chromium...");

    const client = new Client({
        puppeteer: {
            executablePath: process.env.CHROME_BIN || '/usr/bin/chromium',
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--disable-backgrounding-occluded-windows'
            ],
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

    client.on('auth_failure', msg => {
        console.error('AUTHENTICATION FAILURE', msg);
    });

    client.on('disconnected', reason => {
        console.log('Client was logged out', reason);
    });

    try {
        await client.initialize();
        console.log("Client initialized successfully");
    } catch (error) {
        console.error("Error during client initialization:", error);
    }

    app.get('/send', async (req, res) => {
        const { number, message } = req.query;
        if (!number || !message) {
            return res.status(400).send('Please provide number and message');
        }
        const chatId = number + "@c.us";
        try {
            await client.sendMessage(chatId, message);
            res.send('Message sent to ' + number);
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send('Failed to send message');
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
