#!/bin/bash

# Script untuk menjalankan aplikasi di background menggunakan PM2

# Pindah ke direktori script ini berada
cd "$(dirname "$0")"

echo "============================================="
echo " 🚀 Menjalankan WhatsApp Broadcast di Background"
echo "============================================="

# Jalankan PM2 dengan konfigurasi ecosystem
npx pm2 start ecosystem.config.js

echo ""
echo "📊 Status Proses Saat Ini:"
npx pm2 status broadcast-maleo

echo ""
echo "✅ Server berhasil dijalankan di background!"
echo "💡 Tips:"
echo "   - Cek log / Scan QR : npx pm2 logs broadcast-maleo"
echo "   - Hentikan server   : npx pm2 stop broadcast-maleo"
echo "   - Restart server    : npx pm2 restart broadcast-maleo"
