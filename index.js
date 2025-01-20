const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const client = new Client();

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
    await client.sendMessage(chatId, message);
    res.send('Message sent to ' + number);
});

client.initialize();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
