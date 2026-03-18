/**
 * ScottyMd — .del command
 * Deletes a quoted message (bot's own messages or admin use)
 */
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');
const isOwnerOrSudo = require('../lib/isOwner');

async function deleteCommand(sock, chatId, message) {
    try {
        const senderId = getSender(sock, message);
        const isGroup = chatId.endsWith('@g.us');

        const canDelete = message.key.fromMe ||
            isOwnerOrSudo(senderId) ||
            (isGroup && await isAdmin(sock, chatId, senderId));

        if (!canDelete) {
            return await sock.sendMessage(chatId, { text: '❌ You need to be an admin to delete messages.' }, { quoted: message });
        }

        const ctx = message.message?.extendedTextMessage?.contextInfo;
        if (!ctx?.stanzaId) {
            return await sock.sendMessage(chatId, { text: '❌ Reply to the message you want to delete.' }, { quoted: message });
        }

        const deleteKey = {
            remoteJid: chatId,
            fromMe: ctx.participant === (sock.user.id.split(':')[0] + '@s.whatsapp.net'),
            id: ctx.stanzaId,
            participant: ctx.participant
        };

        await sock.sendMessage(chatId, { delete: deleteKey });

    } catch (e) {
        console.error('Delete error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to delete message.' }, { quoted: message });
    }
}

module.exports = deleteCommand;
