/**
 * ScottyMd — .clearwarn command
 * Clears all warnings for a user
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');
const isOwnerOrSudo = require('../lib/isOwner');

const WARN_FILE = './data/warnings.json';

async function clearWarnCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        }

        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        }

        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quotedParticipant && !mentioned.includes(quotedParticipant)) mentioned.push(quotedParticipant);

        let warnings = {};
        try { warnings = JSON.parse(fs.readFileSync(WARN_FILE, 'utf8')); } catch {}

        if (mentioned.length === 0) {
            // Clear all warnings in group
            Object.keys(warnings).forEach(k => {
                if (k.startsWith(chatId)) delete warnings[k];
            });
            fs.writeFileSync(WARN_FILE, JSON.stringify(warnings, null, 2));
            return await sock.sendMessage(chatId, {
                text: '✅ All warnings in this group have been cleared.'
            }, { quoted: message });
        }

        for (const user of mentioned) {
            const key = `${chatId}_${user}`;
            delete warnings[key];
            await sock.sendMessage(chatId, {
                text: `✅ Warnings cleared for @${user.split('@')[0]}`,
                mentions: [user]
            }, { quoted: message });
        }

        fs.writeFileSync(WARN_FILE, JSON.stringify(warnings, null, 2));

    } catch (e) {
        console.error('Clearwarn error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to clear warnings.' }, { quoted: message });
    }
}

module.exports = clearWarnCommand;
