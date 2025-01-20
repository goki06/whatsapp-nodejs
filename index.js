const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "render-session" }),
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

client.on('authenticated', () => {
    console.log('Authenticated successfully!');
});

client.on('auth_failure', msg => {
    console.error('Authentication failure:', msg);
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
        res.status(500).send('Error sending message: ' + error.message);
    }
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
