/**
 * ScottyMd — .mute / .unmute
 * © ScottyMd by Scotty
 */
const { isAdmin, isBotAdmin } = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

async function muteCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us'))
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });

        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId))
            return await sock.sendMessage(chatId, { text: '❌ Only admins can mute.' }, { quoted: message });

        if (!await isBotAdmin(sock, chatId))
            return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });

        await sock.groupSettingUpdate(chatId, 'announcement');
        await sock.sendMessage(chatId, {
            text: '🔇 *Group muted!* Only admins can send messages now.\n_© ScottyMd by Scotty_'
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Mute failed: ' + e.message }, { quoted: message });
    }
}

async function unmuteCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us'))
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });

        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId))
            return await sock.sendMessage(chatId, { text: '❌ Only admins can unmute.' }, { quoted: message });

        if (!await isBotAdmin(sock, chatId))
            return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });

        await sock.groupSettingUpdate(chatId, 'not_announcement');
        await sock.sendMessage(chatId, {
            text: '🔊 *Group unmuted!* Everyone can send messages now.\n_© ScottyMd by Scotty_'
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Unmute failed: ' + e.message }, { quoted: message });
    }
}

module.exports = { muteCommand, unmuteCommand };
