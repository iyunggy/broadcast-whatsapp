const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Middleware untuk parsing JSON
app.use(express.json());

// Status bot WhatsApp
let botReady = false;
let botStatusMessage = "Inisialisasi bot...";

// Inisialisasi WhatsApp Client dengan optimasi ekstrem untuk 1 vCPU 1GB RAM Droplet
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
            "--single-process", // Sangat hemat memori untuk 1 vCPU
            "--disable-gpu",
            "--disable-extensions",
            "--disable-default-apps",
            "--disable-translate",
            "--disable-sync",
            "--disable-background-networking",
            "--disable-software-rasterizer",
            "--mute-audio",
            "--hide-scrollbars",
            "--disable-breakpad",
            "--disable-renderer-backgrounding",
            "--disable-background-timer-throttling",
            "--js-flags=--max-old-space-size=512",
        ],
    },
    webVersionCache: {
        type: "remote",
        remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
});

client.on("loading_screen", (percent, message) => {
    botStatusMessage = `Loading WhatsApp Web: ${percent}% - ${message}`;
    console.log(botStatusMessage);
});

client.on("qr", (qr) => {
    botStatusMessage = "Menunggu Scan QR Code";
    console.log("Scan QR Code ini untuk login:");
    qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
    botStatusMessage = "Autentikasi Berhasil, memuat chat...";
    console.log("WhatsApp Berhasil Terautentikasi / Login!");
});

client.on("auth_failure", (msg) => {
    botReady = false;
    botStatusMessage = `Autentikasi Gagal: ${msg}`;
    console.error(botStatusMessage);
});

client.on("disconnected", (reason) => {
    botReady = false;
    botStatusMessage = `WhatsApp Terputus: ${reason}`;
    console.log(botStatusMessage);
});

client.on("ready", () => {
    botReady = true;
    botStatusMessage = "WhatsApp bot siap digunakan!";
    console.log("✅ WhatsApp bot siap digunakan!");
});

client.initialize();

// Ekspor client dan helper status agar bisa digunakan di routes
module.exports = {
    client,
    isBotReady: () => botReady,
    getBotStatus: () => botStatusMessage,
};

// routes
const broadcastWhatsappRoutes = require("./routes/broadcastWhatsapp");

// Route sederhana & health check
app.get("/", (req, res) => {
    res.json({
        service: "Broadcast WhatsApp API",
        bot_ready: botReady,
        status: botStatusMessage,
    });
});

app.use("/broadcastwhatsapp", broadcastWhatsappRoutes);

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
