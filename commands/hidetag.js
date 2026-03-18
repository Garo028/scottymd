/**
 * ScottyMd — .hidetag command
 * Sends a message that tags all members silently
 */
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');
const isOwnerOrSudo = require('../lib/isOwner');

async function hideTagCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        }
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        }

        const text = args.join(' ') || '📢';
        const meta = await sock.groupMetadata(chatId);
        const mentions = meta.participants.map(p => p.id);

        await sock.sendMessage(chatId, { text, mentions }, { quoted: message });

    } catch (e) {
        console.error('HideTag error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to send hidetag.' }, { quoted: message });
    }
}

module.exports = hideTagCommand;
