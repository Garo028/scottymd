/**
 * ScottyMd — .mugshot command
 * Creates a "wanted" style poster for a user
 * © ScottyMd by Scotty
 */
const { getBuffer } = require('../lib/myfunc');
async function mugshotCommand(sock, chatId, message) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const { getSender } = require('../lib/getSender');
        const target = mentioned[0] || getSender(sock, message);
        const num = target.split('@')[0];
        let ppUrl;
        try { ppUrl = await sock.profilePictureUrl(target, 'image'); } catch { ppUrl = null; }
        const text = `🚨 *WANTED* 🚨\n━━━━━━━━━━━━━━━\n👤 Name: @${num}\n📱 Number: +${num}\n🔍 Status: *Wanted for being too awesome*\n💰 Reward: 999 coins\n━━━━━━━━━━━━━━━\n_ScottyMd Wanted Poster_\n_© ScottyMd by Scotty_`;
        if (ppUrl) {
            const buf = await getBuffer(ppUrl);
            await sock.sendMessage(chatId, { image: buf, caption: text, mentions: [target] }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text, mentions: [target] }, { quoted: message });
        }
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}
module.exports = mugshotCommand;
