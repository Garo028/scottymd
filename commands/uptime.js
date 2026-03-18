/**
 * ScottyMd — .uptime command
 * Shows bot uptime in a clean format
 */
const settings = require('../settings');

const START_TIME = Date.now();

async function uptimeCommand(sock, chatId, message) {
    try {
        const ms = Date.now() - START_TIME;
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours   = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days    = Math.floor(ms / (1000 * 60 * 60 * 24));

        const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

        await sock.sendMessage(chatId, {
            text: `⏱️ *${settings.botName} Uptime*\n\n📅 Days: ${days}\n🕐 Hours: ${hours}\n⏱️ Minutes: ${minutes}\n⚡ Seconds: ${seconds}\n\n💾 RAM Usage: ${ram} MB\n\n_© @Scottymd_`
        }, { quoted: message });

    } catch (e) {
        console.error('Uptime error:', e.message);
    }
}

module.exports = uptimeCommand;
