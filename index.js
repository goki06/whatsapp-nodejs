const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
let qrCodeDataURL = ''; // Variable zur Speicherung des QR-Codes als Base64

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
    console.log('WhatsApp-Bot ist bereit!');
});

// Event Listener für Verbindungsabbrüche
client.on('disconnected', (reason) => {
    console.log('WhatsApp-Bot wurde getrennt:', reason);
    // Optional: Automatische Wiederverbindung oder Neustart der App
});

// Event Listener für Authentifizierungsfehler
client.on('auth_failure', (msg) => {
    console.error('Authentifizierungsfehler:', msg);
});

// API-Endpunkt zum Senden von Nachrichten
app.get('/send', async (req, res) => {
    const { number, message } = req.query;
    if (!number || !message) {
        return res.status(400).send('Bitte gib Nummer und Nachricht an');
    }
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    try {
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
