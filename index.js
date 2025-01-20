const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Puppeteer-Stealth-Plugin aktivieren
puppeteer.use(StealthPlugin());

const app = express();

const client = new Client({
    puppeteer: {
        headless: true,  // Versteckter Modus für Serverumgebungen
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],  // Notwendige Argumente für Render
    },
    authStrategy: new LocalAuth()  // Speichert die Sitzung lokal
});

client.on('qr', qr => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

client.on('message', async msg => {
    console.log(`Message received from ${msg.from}: ${msg.body}`);
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
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
