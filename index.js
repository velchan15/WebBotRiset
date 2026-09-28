const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

// Inisialisasi Client dengan mengarahkan langsung ke Google Chrome di laptopmu
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
    console.log('Mantap! Client WhatsApp sudah siap dan terhubung!');

    const nomorTujuan = '6282315517254@c.us'; 
    
    console.log('Sistem penjadwalan (cron) diaktifkan. Menunggu jadwal eksekusi...');

    // Cron Job: Dieksekusi SETIAP MENIT untuk uji coba
    cron.schedule('0 */12 * * *', () => {
        const waktuSekarang = new Date().toLocaleTimeString('id-ID');
        const pesanNotif = `[${waktuSekarang}] Laporan Rutin Bot 🤖\nStatus: 329 Aplikasi DISKOMINFO terpantau AMAN! 🚀`;

        client.sendMessage(nomorTujuan, pesanNotif)
            .then(() => console.log(`[${waktuSekarang}] Sukses mengirim pesan rutin!`))
            .catch((err) => console.log('Gagal mengirim pesan:', err));
    });
});

// Event 3: Fitur Auto-Reply (Balasan Otomatis)
client.on('message', async (msg) => {
    console.log(`Pesan masuk dari ${msg.from}: ${msg.body}`);
    if (msg.body === '!ping') {
        msg.reply('Pong! Sistem aktif.');
    }
});

// Mulai nyalakan bot
client.initialize();