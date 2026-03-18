/**
 * ScottyMd - .ban / .unban commands
 * Bans/unbans users from using the bot
 */
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');

const BANNED_FILE = './data/banned.json';

function getBanned() {
    try {
        return JSON.parse(fs.readFileSync(BANNED_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveBanned(data) {
    fs.writeFileSync(BANNED_FILE, JSON.stringify(data, null, 2));
}

async function banCommand(sock, chatId, message) {
    try {
        const senderId = getSender(sock, message);
        const isGroup = chatId.endsWith('@g.us');

        // Only owner/admin can ban
        const canBan = isOwnerOrSudo(senderId) || (isGroup && await isAdmin(sock, chatId, senderId));
        if (!canBan) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only admins or the bot owner can ban users.'
            }, { quoted: message });
        }

        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quotedParticipant && !mentioned.includes(quotedParticipant)) mentioned.push(quotedParticipant);

        if (mentioned.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please mention or reply to the user to ban.\n\n*Usage:* .ban @user'
            }, { quoted: message });
        }

        const banned = getBanned();

        for (const user of mentioned) {
            if (isOwnerOrSudo(user)) {
                await sock.sendMessage(chatId, {
                    text: `❌ Cannot ban @${user.split('@')[0]} — they are the bot owner.`,
                    mentions: [user]
                }, { quoted: message });
                continue;
            }

            if (banned.includes(user)) {
                await sock.sendMessage(chatId, {
                    text: `⚠️ @${user.split('@')[0]} is already banned.`,
                    mentions: [user]
                }, { quoted: message });
                continue;
            }

            banned.push(user);
            saveBanned(banned);

            await sock.sendMessage(chatId, {
                text: `🚫 @${user.split('@')[0]} has been *banned* from using the bot.`,
                mentions: [user]
            }, { quoted: message });
        }

    } catch (e) {
        console.error('Ban error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to ban user.' }, { quoted: message });
    }
}

async function unbanCommand(sock, chatId, message) {
    try {
        const senderId = getSender(sock, message);
        const isGroup = chatId.endsWith('@g.us');

        const canUnban = isOwnerOrSudo(senderId) || (isGroup && await isAdmin(sock, chatId, senderId));
        if (!canUnban) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only admins or the bot owner can unban users.'
            }, { quoted: message });
        }

        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quotedParticipant && !mentioned.includes(quotedParticipant)) mentioned.push(quotedParticipant);

        if (mentioned.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please mention or reply to the user to unban.\n\n*Usage:* .unban @user'
            }, { quoted: message });
        }

        let banned = getBanned();

        for (const user of mentioned) {
            if (!banned.includes(user)) {
                await sock.sendMessage(chatId, {
                    text: `⚠️ @${user.split('@')[0]} is not banned.`,
                    mentions: [user]
                }, { quoted: message });
                continue;
            }

            banned = banned.filter(u => u !== user);
            saveBanned(banned);

            await sock.sendMessage(chatId, {
                text: `✅ @${user.split('@')[0]} has been *unbanned* and can use the bot again.`,
                mentions: [user]
            }, { quoted: message });
        }

    } catch (e) {
        console.error('Unban error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to unban user.' }, { quoted: message });
    }
}

module.exports = { banCommand, unbanCommand };
