/** ScottyMd — .short URL shortener command © ScottyMd by Scotty */
const axios = require('axios');
async function shortUrlCommand(sock, chatId, message, args) {
    try {
        const url = args[0]?.trim();
        if (!url || !url.startsWith('http')) return await sock.sendMessage(chatId, { text: '❌ Usage: .short <URL>\nExample: .short https://google.com' }, { quoted: message });
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 10000 });
        await sock.sendMessage(chatId, { text: `🔗 *Shortened URL*\n\n📥 Original: ${url}\n📤 Short: ${res.data}\n\n_© ScottyMd_` }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Could not shorten URL.' }, { quoted: message }); }
}
module.exports = shortUrlCommand;
