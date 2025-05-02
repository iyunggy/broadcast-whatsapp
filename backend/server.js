const express = require("express");
const app = express();
const port = 8000;
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Middleware untuk parsing JSON
app.use(express.json());

// Inisialisasi WhatsApp Client
// const client = new Client({
//     authStrategy: new LocalAuth(), // Menyimpan sesi login
// });
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
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
