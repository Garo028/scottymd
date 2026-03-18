/**
 * ScottyMd — .emojimix command
 * Mixes two emojis into one image using Google's Emoji Kitchen
 * © @Scottymd
 */
const axios = require('axios');

// Convert emoji to codepoint
function toCodepoint(emoji) {
    return [...emoji].map(c => c.codePointAt(0).toString(16)).join('-');
}

async function emojiMixCommand(sock, chatId, message, args) {
    try {
        const input = args.join(' ').trim();
        const emojis = [...input].filter(c => c.codePointAt(0) > 127);

        if (emojis.length < 2) {
            return await sock.sendMessage(chatId, {
                text: '❌ Provide 2 emojis to mix!\n\n*Usage:* .emojimix 😂🔥\n*Example:* .emojimix 🐱🐶'
            }, { quoted: message });
        }

        const e1 = emojis[0];
        const e2 = emojis[1];
        const cp1 = toCodepoint(e1);
        const cp2 = toCodepoint(e2);

        await sock.sendMessage(chatId, { text: `🎨 Mixing ${e1} + ${e2}...` }, { quoted: message });

        // Google Emoji Kitchen API
        const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${cp1}/u${cp1}_u${cp2}.png`;

        try {
            const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
            await sock.sendMessage(chatId, {
                image: Buffer.from(res.data),
                caption: `✨ *Emoji Mix: ${e1} + ${e2}*\n\n_© @Scottymd_`
            }, { quoted: message });
        } catch {
            // Try reversed order
            const url2 = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${cp2}/u${cp2}_u${cp1}.png`;
            const res2 = await axios.get(url2, { responseType: 'arraybuffer', timeout: 10000 });
            await sock.sendMessage(chatId, {
                image: Buffer.from(res2.data),
                caption: `✨ *Emoji Mix: ${e1} + ${e2}*\n\n_© @Scottymd_`
            }, { quoted: message });
        }

    } catch (e) {
        await sock.sendMessage(chatId, {
            text: `❌ This emoji combination is not supported yet.\nTry different emojis like: .emojimix 😂🔥`
        }, { quoted: message });
    }
}
module.exports = emojiMixCommand;
