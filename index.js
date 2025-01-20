import whatsappWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import express from 'express';
import puppeteer from 'puppeteer';

const { Client, LocalAuth } = whatsappWeb;

const app = express();

(async () => {
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const client = new Client({
        puppeteer: {
            browserWSEndpoint: browser.wsEndpoint()
        },
        authStrategy: new LocalAuth()
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
        await client.sendMessage(chatId, message);
        res.send('Message sent to ' + number);
    });

    await client.initialize();

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port ' + (process.env.PORT || 3000));
    });
})();
