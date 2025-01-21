const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');

const app = express();
let qrCodeDataURL = ''; // Variable zur Speicherung des QR-Codes als Base64

// Client-Status-Tracking
let isClientReady = false;

// Erstelle den WhatsApp Client mit optimierten Puppeteer-Flags und persistentem Speicherpfad
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "whatsapp-bot",
        dataPath: "/mnt/whatsapp-session" // Pfad des Railway Volumes
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process',
            '--disable-accelerated-2d-canvas',
            '--window-size=1920,1080'
        ]
    }
});

// Event Listener für QR-Code
client.on('qr', async qr => {
    try {
        // Generiere einen Base64-String des QR-Codes
        qrCodeDataURL = await qrcode.toDataURL(qr);
        console.log('QR-Code generiert und verfügbar unter /qr');
    } catch (err) {
        console.error('Fehler beim Generieren des QR-Codes:', err);
    }
});

// Event Listener für erfolgreiche Verbindung
client.on('ready', () => {
    isClientReady = true;
    console.log('WhatsApp-Bot ist bereit!');
});

// Event Listener für Verbindungsabbrüche
client.on('disconnected', (reason) => {
    isClientReady = false;
    console.log('WhatsApp-Bot wurde getrennt:', reason);
    // Versuch, den Client neu zu starten
    setTimeout(() => {
        console.log('Versuche, den WhatsApp-Bot neu zu starten...');
        client.initialize();
    }, 5000); // Warte 5 Sekunden vor dem Neustart
});

// Event Listener für Authentifizierungsfehler
client.on('auth_failure', (msg) => {
    isClientReady = false;
    console.error('Authentifizierungsfehler:', msg);
    // Versuch, den Client neu zu starten
    setTimeout(() => {
        console.log('Versuche, den WhatsApp-Bot nach Auth-Fehler neu zu starten...');
        client.initialize();
    }, 5000); // Warte 5 Sekunden vor dem Neustart
});

// Event Listener für empfangene Nachrichten (optional)
client.on('message', msg => {
    console.log(`Neue Nachricht von: ${msg.from}, Inhalt: ${msg.body}`);
    // Optional: Auto-Antwort hinzufügen
    /*
    if (msg.body.toLowerCase() === 'hallo') {
        msg.reply('Hallo! Ich bin dein WhatsApp-Bot.');
    }
    */
});

// API-Endpunkt zum Senden von Nachrichten
app.get('/send', async (req, res) => {
    const { number, message } = req.query;
    if (!number || !message) {
        return res.status(400).send('Bitte gib Nummer und Nachricht an');
    }
    const formattedNumber = number.replace(/\D/g, ''); // Entferne alle Nicht-Zahlen
    const chatId = `${formattedNumber}@c.us`;

    if (!isClientReady) {
        return res.status(503).send('WhatsApp-Bot ist nicht bereit. Versuche es später erneut.');
    }

    try {
        const isRegistered = await client.isRegisteredUser(chatId);
        if (!isRegistered) {
            return res.status(400).send('Die Nummer ist nicht bei WhatsApp registriert.');
        }

        await client.sendMessage(chatId, message);
        res.send(`Nachricht an ${number} gesendet`);
    } catch (error) {
        console.error('Fehler beim Senden der Nachricht:', error);
        res.status(500).send(`Fehler beim Senden der Nachricht: ${error.message}`);
    }
});

// Route zur Anzeige des QR-Codes als Bild
app.get('/qr', (req, res) => {
    if (qrCodeDataURL) {
        res.send(`
            <h1>Scanne den QR-Code mit deinem WhatsApp</h1>
            <img src="${qrCodeDataURL}" alt="QR Code" />
        `);
    } else {
        res.send('QR-Code wird generiert, bitte warten...');
    }
});

// Initialisiere den WhatsApp-Client
client.initialize();

// Starte den Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
