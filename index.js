const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

(async () => {
    let executablePath;
    try {
        // Ermittelt den richtigen Chromium-Pfad automatisch für Render
        executablePath = puppeteer.executablePath();
    } catch (error) {
        console.error('Error finding Chromium executable path:', error);
    }

    const client = new Client({
        puppeteer: {
            executablePath: executablePath || '/usr/bin/chromium-browser',  // Fallback-Pfad für Chromium
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
        authStrategy: new LocalAuth() // Speichert die Sitzung lokal
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
