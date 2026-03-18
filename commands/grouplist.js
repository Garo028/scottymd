/**
 * ScottyMd — .grouplist command
 * Lists all groups the bot is currently in
 * © @Scottymd
 */
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender, getBotJid } = require('../lib/getSender');

async function groupListCommand(sock, chatId, message) {
    try {
        const senderId = getSender(sock, message);
        if (!isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only the bot owner can use this command.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: '📋 Fetching group list...' }, { quoted: message });

        const groups = await sock.groupFetchAllParticipating();
        const groupList = Object.values(groups);

        if (groupList.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '📋 The bot is not in any groups yet.'
            }, { quoted: message });
        }

        let text = `📋 *Bot Group List*\n`;
        text += `_Total: ${groupList.length} group(s)_\n`;
        text += '━━━━━━━━━━━━━━━\n\n';

        groupList.forEach((group, i) => {
            text += `*${i + 1}.* ${group.subject}\n`;
            text += `   👥 Members: ${group.participants.length}\n`;
            text += `   🆔 \`${group.id}\`\n\n`;
        });

        text += `_© @Scottymd_`;

        // Split if too long
        if (text.length > 4000) {
            const chunks = text.match(/.{1,3900}/gs) || [text];
            for (const chunk of chunks) {
                await sock.sendMessage(chatId, { text: chunk }, { quoted: message });
            }
        } else {
            await sock.sendMessage(chatId, { text }, { quoted: message });
        }

    } catch (e) {
        console.error('GroupList error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ Could not fetch group list.'
        }, { quoted: message });
    }
}

module.exports = groupListCommand;
