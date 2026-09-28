# 🤖 Riset Otomatisasi WhatsApp Bot (Node.js & WhatsApp-Web.js)

Proyek riset dan *prototype* untuk mengintegrasikan sistem notifikasi WhatsApp otomatis secara *real-time* dan terjadwal menggunakan Node.js. Proyek ini dirancang sebagai simulasi sistem peringatan dini (early warning system) untuk web monitoring.

## 🚀 Fitur Utama
* **Autentikasi Sesi Lokal (`LocalAuth`)**: Menyimpan sesi login WhatsApp agar tidak perlu memindai ulang QR Code setiap kali skrip dijalankan ulang.
* **Pengiriman Pesan Otomatis (Cron Job)**: Memanfaatkan `node-cron` untuk mengirimkan pesan pengingat atau laporan berkala secara otomatis tanpa intervensi manual.
* **Auto-Reply Bot**: Fitur balasan otomatis untuk merespons perintah masuk dari pengguna (seperti `!ping`).

## 🛠️ Tech Stack
* **Language**: JavaScript (Node.js CommonJS)
* **Library Utama**: 
  * `whatsapp-web.js` (Menghubungkan Node.js dengan WhatsApp Web via Puppeteer)
  * `qrcode-terminal` (Menampilkan QR Code langsung di terminal konsol)
  * `node-cron` (Penjadwalan tugas latar belakang / background tasks)

## ⚙️ Cara Instalasi & Menjalankan Proyek

1. **Clone repositori ini atau buka di folder lokal:**
```bash
cd wa-bot-riset

```

2. **Installdependencies:**
```bash
npm install whatsapp-web.js qrcode-terminal node-cron

```

3. **Install Chromium (jika diperlukan oleh Puppeteer):**
```bash
npx puppeteer browsers install chrome

```

4. **Jalankan Bot:**
```bash
node index.js

```

5. **Koneksi:**
Pindai (scan) QR Code yang muncul di terminal menggunakan aplikasi WhatsApp di ponselmu (Linked Devices).

## 📝 Struktur Kode Utama (`index.js`)

Skrip mengonfigurasi `Client` dengan jalur penelusuran peramban lokal, menangani pemindaian QR, menjalankan *cron job* berkala, serta memantau pesan masuk untuk fitur *auto-reply*.
