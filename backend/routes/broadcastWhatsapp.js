// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const XLSX = require("xlsx");
// const { client } = require("../server"); // Import client dari server.js

// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/uploadphone", upload.single("phone"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const { message } = req.body;
//   const image = req.files.image ? req.files.image[0] : null; // Menangani gambar jika ada


//   if (!message) {
//     return res.status(400).json({ error: "Message Tidak boleh kosong" });
//   }

//   try {
//     const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//     // console.log("🚀 ~ router.post ~ data:", data);

//     const results = [];
//     for (let number of data) {
//       const whatsappNumber = number.phonenumber.toString() + "@c.us";
//       console.log("📞 Mengirim ke:", whatsappNumber);

//     // Format pesan jika ada line breaks
//     const formattedMessage = message.replace(/\\n/g, '\n'); // jika ada '\\n' dalam teks

//       try {
//         await client.sendMessage(whatsappNumber, formattedMessage);
//         results.push({ number, status: "Sent" });
//       } catch (error) {
//         results.push({ number, status: "Failed", error: error.toString() });
//       }
//     }

//     res.json({ results });
//   } catch (error) {
//     res.status(500).json({ message: "Error processing file", error });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const { Client, MessageMedia } = require("whatsapp-web.js");  // Import MessageMedia
const { client } = require("../server"); // Import client dari server.js

const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadphone", upload.fields([{ name: "phone" }, { name: "image" }]), async (req, res) => {
  if (!req.files || !req.files.phone) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { message } = req.body;
  const image = req.files.image ? req.files.image[0] : null; // Menangani gambar jika ada
  console.log('image', image)

  if (!message) {
    return res.status(400).json({ error: "Message Tidak boleh kosong" });
  }

  try {
    // Membaca file Excel
    const workbook = XLSX.read(req.files.phone[0].buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const results = [];
    for (let number of data) {
      const whatsappNumber = number.phonenumber.toString() + "@c.us";
      console.log("📞 Mengirim ke:", whatsappNumber);

      // Format pesan jika ada line breaks
      const formattedMessage = message.replace(/\\n/g, '\n'); // jika ada '\\n' dalam teks

      try {
        if (image) {
          // Ensure the image is properly received
          console.log(`Image MIME type: ${image.mimetype}`);
          console.log(`Image size: ${image.buffer.length} bytes`);

          // Create MessageMedia with the correct MIME type and base64 encoding
          const media = new MessageMedia(image.mimetype, image.buffer.toString('base64'), image.originalname);

          // Send message with image
          await client.sendMessage(whatsappNumber, formattedMessage, { media });
        } else {
          // Send message without image
          await client.sendMessage(whatsappNumber, formattedMessage);
        }

        results.push({ number: whatsappNumber, status: "Sent" });
      } catch (error) {
        results.push({ number: whatsappNumber, status: "Failed", error: error.toString() });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error });
  }
});

module.exports = router;


