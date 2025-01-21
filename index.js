import express from 'express';
import qrcode from 'qrcode-terminal';
import puppeteer from 'puppeteer';
import whatsappWeb from 'whatsapp-web.js';

const { Client, LocalAuth } = whatsappWeb;

const app = express();

(async () => {
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const client = new Client({
        puppeteer: {
            browserWSEndpoint: browser.wsEndpoint()
        },
        authStrategy: new LocalAuth()
    });

    client.on('qr', qr => {
        console.log('Scan this QR code:');
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
