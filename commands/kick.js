/**
 * ScottyMd — .kick command
 * © ScottyMd by Scotty
 */
const { isAdmin, isBotAdmin } = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

async function kickCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us'))
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });

        const senderId = getSender(sock, message);
        const senderAdmin = await isAdmin(sock, chatId, senderId);
        const senderOwner = isOwnerOrSudo(senderId);

        if (!senderAdmin && !senderOwner)
            return await sock.sendMessage(chatId, { text: '❌ Only admins can use this command.' }, { quoted: message });

        const botAdmin = await isBotAdmin(sock, chatId);
        if (!botAdmin)
            return await sock.sendMessage(chatId, { text: '❌ Please make me an admin first.' }, { quoted: message });

        const mentioned = [
            ...(message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])
        ];
        const quoted = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quoted && !mentioned.includes(quoted)) mentioned.push(quoted);

        if (!mentioned.length)
            return await sock.sendMessage(chatId, {
                text: '❌ Please mention or reply to the user to kick.\n*Usage:* .kick @user'
            }, { quoted: message });

        for (const user of mentioned) {
            const userIsAdmin = await isAdmin(sock, chatId, user);
            if (userIsAdmin) {
                await sock.sendMessage(chatId, {
                    text: `⚠️ Cannot kick @${user.split('@')[0]} — they are an admin.`,
                    mentions: [user]
                }, { quoted: message });
                continue;
            }
            try {
                await sock.groupParticipantsUpdate(chatId, [user], 'remove');
                await sock.sendMessage(chatId, {
                    text: `✅ @${user.split('@')[0]} has been kicked.\n_© ScottyMd by Scotty_`,
                    mentions: [user]
                });
            } catch (e) {
                await sock.sendMessage(chatId, {
                    text: `❌ Could not kick @${user.split('@')[0]}: ${e.message}`,
                    mentions: [user]
                }, { quoted: message });
            }
        }
    } catch (e) {
        console.error('Kick error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Kick failed: ' + e.message }, { quoted: message });
    }
}

module.exports = kickCommand;
