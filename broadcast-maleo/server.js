const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Middleware untuk parsing JSON
app.use(express.json());

// Inisialisasi WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(), // Menyimpan sesi login
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--disable-gpu",
        ],
    },
});

client.on("qr", (qr) => {
    console.log("Scan QR Code ini untuk login:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp bot siap!");
});

client.initialize();

// Ekspor client agar bisa digunakan di routes
module.exports.client = client;

// routes
const broadcastWhatsappRoutes= require('./routes/broadcastWhatsapp')

// Route sederhana
app.get("/", (req, res) => {
    res.send("Hello, Express!");
});

app.use('/broadcastwhatsapp', broadcastWhatsappRoutes)

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
