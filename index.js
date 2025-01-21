const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const app = express();
let qrCodeString = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    }
});

client.on('qr', qr => {
    qrCodeString = qr;
    qrcode.toFile('public/qr-code.png', qr, function (err) {
        if (err) console.error('Fehler beim Erstellen des QR-Codes:', err);
        else console.log('QR-Code gespeichert unter /public/qr-code.png');
    });
});

client.on('ready', () => {
    console.log('WhatsApp bot ist bereit!');
});

app.get('/send', async (req, res) => {
    const { number, message } = req.query;
    if (!number || !message) {
        return res.status(400).send('Bitte gib Nummer und Nachricht an');
    }
    const chatId = `${number}@c.us`;
    await client.sendMessage(chatId, message);
    res.send(`Nachricht an ${number} gesendet`);
});

// Route für QR-Code-Anzeige
app.use('/public', express.static('public'));

app.get('/qr', (req, res) => {
    res.send('<h1>Scanne den QR-Code</h1><img src="/public/qr-code.png" />');
});

client.initialize();

app.listen(process.env.PORT || 8080, () => {
    console.log('Server läuft auf Port ' + (process.env.PORT || 8080));
});
