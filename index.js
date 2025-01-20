const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

// Definiere den richtigen Chromium-Pfad für Render.com
const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/chromium';

const client = new Client({
    puppeteer: {
        executablePath: CHROME_PATH,
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

client.initialize().catch(error => {
    console.error("Error during client initialization:", error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
