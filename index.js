const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

const client = new Client({
    puppeteer: {
        executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser',  // Render erwartet möglicherweise diesen Pfad
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--disable-background-networking'
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
    console.error('AUTHENTICATION FAILURE:', msg);
});

client.on('disconnected', reason => {
    console.log('Client was logged out:', reason);
});

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

client.initialize();
