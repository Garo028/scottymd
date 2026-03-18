/**
 * ScottyMd — .demote command
 * © ScottyMd by Scotty
 */
const { isAdmin, isBotAdmin } = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

async function demoteCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us'))
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });

        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId))
            return await sock.sendMessage(chatId, { text: '❌ Only admins can use this.' }, { quoted: message });

        if (!await isBotAdmin(sock, chatId))
            return await sock.sendMessage(chatId, { text: '❌ Please make me an admin first.' }, { quoted: message });

        const mentioned = [...(message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])];
        const quoted = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quoted && !mentioned.includes(quoted)) mentioned.push(quoted);

        if (!mentioned.length)
            return await sock.sendMessage(chatId, { text: '❌ Usage: .demote @user' }, { quoted: message });

        for (const user of mentioned) {
            await sock.groupParticipantsUpdate(chatId, [user], 'demote');
            await sock.sendMessage(chatId, {
                text: `🔻 @${user.split('@')[0]} has been demoted.\n_© ScottyMd by Scotty_`,
                mentions: [user]
            });
        }
    } catch (e) {
        console.error('Demote error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Demote failed: ' + e.message }, { quoted: message });
    }
}

module.exports = { demoteCommand };
