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
            "--disable-extensions",
        ],
    },
    webVersionCache: {
        type: "remote",
        remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
});

client.on("loading_screen", (percent, message) => {
    console.log(`Loading WhatsApp Web: ${percent}% - ${message}`);
});

client.on("qr", (qr) => {
    console.log("Scan QR Code ini untuk login:");
    qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
    console.log("WhatsApp Berhasil Terautentikasi / Login!");
});

client.on("auth_failure", (msg) => {
    console.error("Autentikasi Gagal:", msg);
});

client.on("ready", () => {
    console.log("WhatsApp bot siap digunakan!");
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
