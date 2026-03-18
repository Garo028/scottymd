/**
 * ScottyMd — .link command
 * Get preview info for any URL
 * © @Scottymd
 */
const axios = require('axios');

async function linkCommand(sock, chatId, message, args) {
    try {
        const url = args[0];
        if (!url || !url.startsWith('http')) return await sock.sendMessage(chatId, { text: '❌ Usage: .link <url>' }, { quoted: message });
        const res  = await axios.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, { timeout: 15000 });
        const d    = res.data?.data;
        if (!d) return await sock.sendMessage(chatId, { text: '❌ Could not fetch link info.' }, { quoted: message });

        const title = d.title || 'No title';
        const desc  = d.description || 'No description';
        const site  = d.publisher || new URL(url).hostname;

        let text = `🔗 *Link Preview*\n\n📰 *${title}*\n\n📝 ${desc.slice(0, 200)}${desc.length > 200 ? '...' : ''}\n\n🌐 ${site}\n🔗 ${url}\n\n_© @Scottymd_`;

        if (d.image?.url) {
            try {
                const img = await axios.get(d.image.url, { responseType: 'arraybuffer', timeout: 10000 });
                return await sock.sendMessage(chatId, { image: Buffer.from(img.data), caption: text }, { quoted: message });
            } catch {}
        }
        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Link preview failed.' }, { quoted: message });
    }
}
module.exports = linkCommand;
