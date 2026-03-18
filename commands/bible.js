/**
 * ScottyMd — .bible command
 * Get Bible verses
 * © @Scottymd
 */
const axios = require('axios');

async function bibleCommand(sock, chatId, message, args) {
    try {
        if (!args.length) {
            // Random verse
            const res = await axios.get('https://bible-api.com/?random=verse', { timeout: 10000 });
            const { reference, text } = res.data;
            return await sock.sendMessage(chatId, {
                text: `📖 *${reference}*\n\n_${text.trim()}_\n\n_© @Scottymd_`
            }, { quoted: message });
        }
        const verse = args.join(' ');
        const res = await axios.get(`https://bible-api.com/${encodeURIComponent(verse)}`, { timeout: 10000 });
        const { reference, text } = res.data;
        if (!text) return await sock.sendMessage(chatId, { text: '❌ Verse not found. Try: .bible John 3:16' }, { quoted: message });
        await sock.sendMessage(chatId, {
            text: `📖 *${reference}*\n\n_${text.trim()}_\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Could not fetch verse. Try: .bible John 3:16\n.bible (random verse)' }, { quoted: message });
    }
}
module.exports = bibleCommand;
