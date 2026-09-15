#!/bin/bash

# Script Pengelola PM2 untuk broadcast-maleo

cd "$(dirname "$0")"

ACTION=$1

case "$ACTION" in
  start)
    echo "🚀 Menjalankan broadcast-maleo di background..."
    npx pm2 start ecosystem.config.js
    npx pm2 status broadcast-maleo
    ;;
  stop)
    echo "🛑 Menghentikan broadcast-maleo..."
    npx pm2 stop broadcast-maleo
    ;;
  restart)
    echo "🔄 Me-restart broadcast-maleo..."
    npx pm2 restart broadcast-maleo
    ;;
  logs)
    echo "📜 Membuka logs (tekan Ctrl+C untuk keluar)..."
    npx pm2 logs broadcast-maleo
    ;;
  status)
    npx pm2 status
    ;;
  delete)
    echo "🗑️ Menghapus proses broadcast-maleo dari PM2..."
    npx pm2 delete broadcast-maleo
    ;;
  *)
    echo "Penggunaan: bash $0 {start|stop|restart|logs|status|delete}"
    echo ""
    echo "Contoh:"
    echo "  bash pm2.sh start    -> Jalankan di background"
    echo "  bash pm2.sh logs     -> Lihat log & Scan QR Code"
    echo "  bash pm2.sh status   -> Cek status proses"
    echo "  bash pm2.sh restart  -> Restart server"
    echo "  bash pm2.sh stop     -> Hentikan server"
    ;;
esac
