/** ScottyMd — .confess anonymous confession © ScottyMd by Scotty */
const isOwnerOrSudo = require('../lib/isOwner');
async function confessCommand(sock, chatId, message, args) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .confess <your confession>' }, { quoted: message });
    if (text.length < 10) return await sock.sendMessage(chatId, { text: '❌ Confession too short.' }, { quoted: message });
    await sock.sendMessage(chatId, { text: `🤫 *Anonymous Confession*\n\n"_${text}_"\n\n_Anonymous • ScottyMd_` });
}
module.exports = confessCommand;
