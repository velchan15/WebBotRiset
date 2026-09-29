const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

// Inisialisasi Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    }
});

// Event 1: Memunculkan QR Code di terminal
client.on('qr', (qr) => {
    console.log('Silakan scan QR Code ini menggunakan WhatsApp kamu:');
    qrcode.generate(qr, { small: true });
});

// Event 2: Jika berhasil terhubung
client.on('ready', () => {
    console.log('Client WhatsApp sudah siap dan terhubung!');
    const nomorTujuan = '6282315517254@c.us'; 
    
    console.log('Sistem penjadwalan (cron) diaktifkan. Menunggu jadwal eksekusi (Tiap 1 Menit untuk tes)...');

    // Cron Job: Dieksekusi SETIAP 1 MENIT (* * * * *) untuk UJI COBA
    // Bisa kembalikan jadi '0 */12 * * *' (tiap 12 jam)
   cron.schedule('0 */12 * * *', async () => {
        try {
            const waktuSekarang = new Date().toLocaleTimeString('id-ID');
            console.log(`[${waktuSekarang}] Meminta data terbaru dari API Web Monitoring...`);

            // 1. Tarik data ASLI dari backend lokal kamu
           const response = await fetch('https://monitoringsystemaptikatools-production.up.railway.app/api/applications/status-bot');
            const apps = await response.json();

            // 2. Cek apakah ada aplikasi yang mati (Misal statusnya 'OFFLINE')
            // Catatan: Pastikan string 'OFFLINE' sesuai dengan status di database kamu
            const aplikasiDown = apps.filter(app => app.status === 'OFFLINE');

            // 3. Logika pengiriman
            if (aplikasiDown.length > 0) {
                let pesanNotif = `🚨 *PERINGATAN SISTEM!* [${waktuSekarang}] 🚨\n\n`;
                pesanNotif += `Terdapat *${aplikasiDown.length} aplikasi* yang terdeteksi DOWN:\n\n`;

                aplikasiDown.forEach((app, index) => {
                    pesanNotif += `${index + 1}. ${app.name} (URL: ${app.url})\n`;
                });

                pesanNotif += `\nMohon segera lakukan pengecekan di dashboard!`;

                await client.sendMessage(nomorTujuan, pesanNotif);
                console.log(`[${waktuSekarang}] Pesan PERINGATAN terkirim ke WhatsApp!`);
            } else {
                // Jika semuanya aman
                const pesanAman = `[${waktuSekarang}] Laporan Rutin Bot 🤖\nStatus: ${apps.length} Aplikasi terpantau AMAN! 🚀`;
                await client.sendMessage(nomorTujuan, pesanAman);
                console.log(`[${waktuSekarang}] Pesan laporan AMAN terkirim ke WhatsApp!`);
            }

        } catch (error) {
            console.log('Gagal terhubung ke API Backend:', error.message);
        }
    });
});

/// ==================================================
// Event 3: Fitur Auto-Reply (GANTI JADI message_create)
// ==================================================
client.on('message_create', async (msg) => {
    // Abaikan jika pesannya kosong
    if (!msg.body) return;

    // Log pesan di terminal agar ketahuan masuk atau tidak
    console.log(`Pesan terdeteksi: ${msg.body}`);
    
    if (msg.body === '!ping') {
        msg.reply('Pong! Sistem aktif.');
    } 
    else if (msg.body === '!status') {
        try {
            msg.reply('Sedang mengecek status aplikasi, mohon tunggu sebentar... ⏳');
            
            // Mengambil data dari backend
            const response = await fetch('https://monitoringsystemaptikatools-production.up.railway.app/api/applications/status-bot');
            const apps = await response.json();
            
            // Menyaring aplikasi yang mati
            const aplikasiDown = apps.filter(app => app.status === 'OFFLINE');
            
            // Membuat pesan balasan
            let pesanBalasan = `📊 *LAPORAN REAL-TIME* 📊\n\n`;
            pesanBalasan += `Total Aplikasi: ${apps.length}\nAman: ${apps.length - aplikasiDown.length} ✅\nDown: ${aplikasiDown.length} ❌`;
            
            msg.reply(pesanBalasan);
        } catch (error) {
            console.error(error);
            msg.reply('Maaf, bot gagal terhubung ke server database 😔');
        }
    }
});

// Mulai nyalakan bot
client.initialize();