import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import express from 'express';
import puppeteer from 'puppeteer';

<<<<<<< HEAD
const { Client, LocalAuth } = pkg;

=======
>>>>>>> Fixed Puppeteer executable path
const app = express();

(async () => {
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: puppeteer.executablePath()  // Verwende den mitgelieferten Chrome
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
