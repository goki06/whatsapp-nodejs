const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
let qrCodeString = '';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',                // Wichtig für Root-Benutzer
            '--disable-setuid-sandbox',    // Deaktiviert setuid Sandbox
            '--disable-dev-shm-usage',     // Vermeidet Speicherprobleme
            '--disable-gpu',               // Deaktiviert GPU-Nutzung
            '--no-zygote',                 // Verhindert Sandbox-Probleme
            '--single-process'             // Verhindert Multi-Prozess-Modus
        ]
    }
});

client.on('qr', qr => {
    qrCodeString = qr;
    console.log('Scan this QR code:');
    qrcode.generate(qr, { small: true });
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

// Neue Route für den QR-Code
app.get('/qr', (req, res) => {
    if (qrCodeString) {
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeString)}&size=200x200`;
        res.send(`<img src="${qrImageUrl}" alt="QR Code"/>`);
    } else {
        res.send('QR-Code wird generiert, bitte warten...');
    }
});

client.initialize();

app.listen(process.env.PORT || 8080, () => {
    console.log('Server läuft auf Port ' + (process.env.PORT || 8080));
});
