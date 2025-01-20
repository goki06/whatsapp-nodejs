const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('QR Code erhalten. Scanne ihn mit deiner WhatsApp-App.');
});

client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

app.get('/send', async (req, res) => {
    const { number, message } = req.query;
    if (!number || !message) {
        return res.status(400).send('Bitte gebe Nummer und Nachricht an.');
    }
    const chatId = number + "@c.us";
    await client.sendMessage(chatId, message);
    res.send('Nachricht gesendet an ' + number);
});

client.initialize();

app.listen(process.env.PORT || 3000, () => {
    console.log('Server läuft auf Port ' + (process.env.PORT || 3000));
});
