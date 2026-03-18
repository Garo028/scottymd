/**
 * ScottyMd — .forward command
 * Forward a message to another chat
 * © @Scottymd
 */
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender }  = require('../lib/getSender');

async function forwardCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        if (!isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Owner only.' }, { quoted: message });

        const targetNumber = args[0]?.replace(/[^0-9]/g, '');
        if (!targetNumber) return await sock.sendMessage(chatId, { text: '❌ Usage: .forward <number> (reply to message)' }, { quoted: message });

        const ctx     = message.message?.extendedTextMessage?.contextInfo;
        const quoted  = ctx?.quotedMessage;
        if (!quoted) return await sock.sendMessage(chatId, { text: '❌ Reply to the message you want to forward.' }, { quoted: message });

        const targetJid = targetNumber + '@s.whatsapp.net';
        const fwdMsg    = {
            forward: {
                key: { remoteJid: chatId, id: ctx.stanzaId, fromMe: false, participant: ctx.participant },
                message: quoted
            }
        };

        await sock.sendMessage(targetJid, { text: Object.values(quoted)[0]?.text || Object.values(quoted)[0]?.caption || 'Forwarded message' });
        await sock.sendMessage(chatId, { text: `✅ Message forwarded to +${targetNumber}\n\n_© @Scottymd_` }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Forward failed: ' + e.message }, { quoted: message });
    }
}
module.exports = forwardCommand;
