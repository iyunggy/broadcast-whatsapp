const express = require("express");
const router = express.Router();
const { client, isBotReady, getBotStatus } = require("../server");

// Helper kirim pesan dengan batas timeout (15 detik) agar tidak hanging
function sendMessageWithTimeout(target, message, timeoutMs = 15000) {
  return Promise.race([
    client.sendMessage(target, message),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout: WhatsApp bot tidak merespons dalam 15 detik")), timeoutMs)
    ),
  ]);
}

router.get("/", async (req, res) => {
  res.json({
    message: "API Broadcast WhatsApp",
    bot_ready: isBotReady(),
    bot_status: getBotStatus(),
    endpoints: {
      "GET /broadcastwhatsapp/status": "Cek status kesiapan bot",
      "POST /broadcastwhatsapp/personal": {
        payload: { phone: "6281234567890", message: "Pesan teks" },
      },
      "POST /broadcastwhatsapp/group": {
        payload: { id_group_chat: "120363028123456789@g.us", message: "Pesan teks" },
      },
    },
  });
});

router.get("/status", (req, res) => {
  res.json({
    bot_ready: isBotReady(),
    status: getBotStatus(),
  });
});

router.get("/personal", (req, res) => {
  res.status(405).json({
    status: 405,
    message: "Method GET tidak didukung. Gunakan method POST.",
    example_payload: {
      phone: "6281234567890",
      message: "Isi pesan broadcast",
    },
  });
});

router.get("/group", (req, res) => {
  res.status(405).json({
    status: 405,
    message: "Method GET tidak didukung. Gunakan method POST.",
    example_payload: {
      id_group_chat: "120363028123456789@g.us",
      message: "Isi pesan broadcast ke grup",
    },
  });
});

router.post("/personal", async (req, res) => {
  const { phone, message } = req.body;

  if (!isBotReady()) {
    return res.status(503).json({
      status: "Failed",
      error: `WhatsApp bot belum siap (${getBotStatus()}). Silakan cek status di log PM2.`,
    });
  }

  if (!phone || !message) {
    return res
      .status(400)
      .json({ error: "Phone dan message tidak boleh kosong" });
  }

  const whatsappNumber = phone.toString() + "@c.us";

  try {
    await sendMessageWithTimeout(whatsappNumber, message);
    res.json({ number: whatsappNumber, status: "Sent" });
  } catch (error) {
    res.status(500).json({
      number: whatsappNumber,
      status: "Failed",
      error: error.message || error.toString(),
    });
  }
});

router.post("/group", async (req, res) => {
  const { id_group_chat, message } = req.body;

  if (!isBotReady()) {
    return res.status(503).json({
      status: "Failed",
      error: `WhatsApp bot belum siap (${getBotStatus()}). Silakan cek status di log PM2.`,
    });
  }

  if (!id_group_chat || !message) {
    return res.status(400).json({ error: "ID grup dan message tidak boleh kosong" });
  }

  const whatsappNumber = id_group_chat;

  try {
    await sendMessageWithTimeout(whatsappNumber, message);
    res.json({ number: whatsappNumber, status: "Sent" });
  } catch (error) {
    res.status(500).json({
      number: whatsappNumber,
      status: "Failed",
      error: error.message || error.toString(),
    });
  }
});

module.exports = router;
