/**
 * ScottyMd — .lock / .unlock command
 * Lock group settings (prevent members from changing icon, name, description)
 * © @Scottymd
 */
const { isBotAdmin } = require('../lib/isAdmin');

async function lockCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        if (!await isBotAdmin(sock, chatId)) return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });
        await sock.groupSettingUpdate(chatId, 'locked');
        await sock.sendMessage(chatId, { text: '🔒 *Group settings locked.*\nOnly admins can edit group info.\n\n_© @Scottymd_' }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Lock failed: ' + e.message }, { quoted: message }); }
}

async function unlockCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        if (!await isBotAdmin(sock, chatId)) return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });
        await sock.groupSettingUpdate(chatId, 'unlocked');
        await sock.sendMessage(chatId, { text: '🔓 *Group settings unlocked.*\nAll members can edit group info.\n\n_© @Scottymd_' }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Unlock failed: ' + e.message }, { quoted: message }); }
}
module.exports = { lockCommand, unlockCommand };
