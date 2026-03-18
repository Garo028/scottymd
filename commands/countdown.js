/** ScottyMd — .countdown to a date © ScottyMd by Scotty */
async function countdownCommand(sock, chatId, message, args) {
    const input = args.join(' ').trim();
    if (!input) return await sock.sendMessage(chatId, { text: '❌ Usage: .countdown DD/MM/YYYY\nExample: .countdown 25/12/2025' }, { quoted: message });
    const parts = input.split(/[\/\-\.]/);
    const target = new Date(+parts[2], +parts[1]-1, +parts[0]);
    if (isNaN(target)) return await sock.sendMessage(chatId, { text: '❌ Invalid date format. Use DD/MM/YYYY' }, { quoted: message });
    const now  = new Date(); const diff = target - now;
    if (diff < 0) return await sock.sendMessage(chatId, { text: '❌ That date has already passed!' }, { quoted: message });
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff%86400000) / 3600000);
    const minutes = Math.floor((diff%3600000) / 60000);
    await sock.sendMessage(chatId, { text: `⏳ *Countdown to ${input}*\n\n📅 ${days} days\n🕐 ${hours} hours\n⏱️ ${minutes} minutes\n\n_© ScottyMd_` }, { quoted: message });
}
module.exports = countdownCommand;
