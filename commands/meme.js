/**
 * ScottyMd — .meme command
 * Random meme from Reddit
 * © @Scottymd
 */
const axios = require('axios');

async function memeCommand(sock, chatId, message) {
    try {
        await sock.sendMessage(chatId, { text: '😂 Fetching meme...' }, { quoted: message });
        const res  = await axios.get('https://meme-api.com/gimme', { timeout: 10000 });
        const meme = res.data;
        if (!meme?.url) return await sock.sendMessage(chatId, { text: '❌ Could not fetch meme.' }, { quoted: message });
        const img = await axios.get(meme.url, { responseType: 'arraybuffer', timeout: 15000 });
        await sock.sendMessage(chatId, {
            image: Buffer.from(img.data),
            caption: `😂 *${meme.title}*\n👍 ${meme.ups} upvotes | r/${meme.subreddit}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Meme fetch failed.' }, { quoted: message });
    }
}
module.exports = memeCommand;
