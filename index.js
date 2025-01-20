import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

(async () => {
    console.log("Launching Chromium...");
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
        try {
            const chatId = number + "@c.us";
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
