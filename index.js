const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();

// Initialisiere den WhatsApp-Client mit lokalem Auth-Cache
const client = new Client({
    authStrategy: new LocalAuth(),  // Speichert die Session, kein erneutes Scannen erforderlich
    puppeteer: {
        headless: true, // Auf 'false' setzen, wenn du den Browser zur Fehlerbehebung sehen möchtest
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR-Code generieren
client.on('qr', qr => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

// Erfolgreiche Verbindung
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

// Fehlerbehandlung für unerwartete Trennungen
client.on('disconnected', (reason) => {
    console.log('Client wurde getrennt:', reason);
    process.exit(1);  // Neustart des Bots nach Trennung
});

// API-Route zum Senden von Nachrichten
app.get('/send', async (req, res) => {
    const { number, message } = req.query;

    if (!number || !message) {
        return res.status(400).send('Fehlende Parameter: Nummer und Nachricht erforderlich');
    }

    const chatId = number.includes('@c.us') ? number : number + "@c.us";  // Sicherstellen, dass Format korrekt ist

    try {
        await client.sendMessage(chatId, message);
        res.send(`Nachricht erfolgreich an ${number} gesendet.`);
    } catch (error) {
        console.error('Fehler beim Senden der Nachricht:', error);
        res.status(500).send('Fehler beim Senden der Nachricht.');
    }
});

// Starte den WhatsApp-Client
client.initialize();

// Starte den Express-Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

client.on('message', async message => {
    console.log(`Nachricht von ${message.from}: ${message.body}`);

    if (message.body.toLowerCase() === 'hallo') {
        await message.reply('Hallo! Wie kann ich dir helfen?');
    }
});
