const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

const client = new Client({
    puppeteer: {
        executablePath: puppeteer.executablePath(),  // Verwende eingebettetes Chromium
        headless: true,  // Versteckter Modus für Serverumgebungen
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Notwendige Argumente für Render
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
        console.error("Failed to send message:", error);
        res.status(500).send("Failed to send message");
    }
});

client.initialize();

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port ' + (process.env.PORT || 3000));
});
