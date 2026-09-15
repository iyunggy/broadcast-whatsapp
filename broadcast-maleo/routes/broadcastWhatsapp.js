const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const { Client, MessageMedia } = require("whatsapp-web.js"); // Import MessageMedia
const { client } = require("../server"); // Import client dari server.js

router.get("/", async (req, res) => {
  res.json({
    message: "API Broadcast WhatsApp",
    endpoints: {
      "POST /broadcastwhatsapp/personal": {
        payload: { phone: "6281234567890", message: "Pesan teks" },
      },
      "POST /broadcastwhatsapp/group": {
        payload: { id_group_chat: "120363028123456789@g.us", message: "Pesan teks" },
      },
    },
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
  // console.log("🚀 ~ router.post ~ phone:", phone)
  // console.log("🚀 ~ router.post ~ message:", message)
  

  if (!phone || !message) {
    return res
      .status(400)
      .json({ error: "Phone dan message tidak boleh kosong" });
  }

  try {
    const whatsappNumber = phone.toString() + "@c.us";
    // console.log("📞 Mengirim ke:", whatsappNumber);

    try {
      await client.sendMessage(whatsappNumber, message);
      res.json({ number: whatsappNumber, status: "Sent" });
    } catch (error) {
      res.json({
        number: whatsappNumber,
        status: "Failed",
        error: error.toString(),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

router.post("/group", async (req, res) => {
  const { id_group_chat, message } = req.body;
  // console.log("🚀 ~ router.post ~ id_group_chat:", id_group_chat)
  // console.log("🚀 ~ router.post ~ message:", message)

  if (!id_group_chat || !message) {
    return res.status(400).json({ error: "ID grup dan message tidak boleh kosong" });
  }

  try {
    const whatsappNumber = id_group_chat;
    // console.log("📞 Mengirim ke:", whatsappNumber);

    try {
      await client.sendMessage(whatsappNumber, message);
      res.json({ number: whatsappNumber, status: "Sent" });
    } catch (error) {
      res.json({
        number: whatsappNumber,
        status: "Failed",
        error: error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

module.exports = router;
