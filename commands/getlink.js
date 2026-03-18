/**
 * ScottyMd — .getlink command
 * Gets the current group invite link
 * © @Scottymd
 */
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');
const isOwnerOrSudo = require('../lib/isOwner');

async function getLinkCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command only works in groups.'
            }, { quoted: message });
        }

        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only admins can get the group link.'
            }, { quoted: message });
        }

        const botJid = getBotJid(sock);
        if (!await isAdmin(sock, chatId, botJid)) {
            return await sock.sendMessage(chatId, {
                text: '❌ I need to be an admin to fetch the group link.'
            }, { quoted: message });
        }

        const code = await sock.groupInviteCode(chatId);
        const link = `https://chat.whatsapp.com/${code}`;
        const meta = await sock.groupMetadata(chatId);

        await sock.sendMessage(chatId, {
            text: `🔗 *Group Invite Link*\n\n📛 Group: *${meta.subject}*\n\n${link}\n\n_Share this link to invite people._\n_Use .resetlink to revoke and generate a new one._\n\n_© @Scottymd_`
        }, { quoted: message });

    } catch (e) {
        console.error('GetLink error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ Could not fetch group link. Make sure I am an admin.'
        }, { quoted: message });
    }
}

module.exports = getLinkCommand;
