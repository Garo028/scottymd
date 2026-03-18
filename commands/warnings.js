/**
 * ScottyMd — .warnings command
 * Check how many warnings a user has
 */
const fs = require('fs');
const { WARN_COUNT } = require('../config');

const WARN_FILE = './data/warnings.json';

function getWarnings() {
    try { return JSON.parse(fs.readFileSync(WARN_FILE, 'utf8')); }
    catch { return {}; }
}

async function warningsCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command only works in groups.'
            }, { quoted: message });
        }

        const warnings = getWarnings();
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quotedParticipant && !mentioned.includes(quotedParticipant)) mentioned.push(quotedParticipant);

        if (mentioned.length === 0) {
            // Show all warnings in group
            const groupWarnings = Object.entries(warnings)
                .filter(([k]) => k.startsWith(chatId))
                .filter(([, v]) => v > 0);

            if (groupWarnings.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '✅ No warnings in this group.'
                }, { quoted: message });
            }

            const maxWarns = WARN_COUNT || 3;
            let text = `⚠️ *Group Warnings*\n\n`;
            const mentions = [];

            for (const [key, count] of groupWarnings) {
                const uid = key.replace(chatId + '_', '');
                text += `@${uid.split('@')[0]}: ${count}/${maxWarns}\n`;
                mentions.push(uid);
            }

            return await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
        }

        // Show specific user warnings
        const maxWarns = WARN_COUNT || 3;
        for (const user of mentioned) {
            const key = `${chatId}_${user}`;
            const count = warnings[key] || 0;
            await sock.sendMessage(chatId, {
                text: `⚠️ *Warnings for @${user.split('@')[0]}*\n\n${count}/${maxWarns} warnings`,
                mentions: [user]
            }, { quoted: message });
        }

    } catch (e) {
        console.error('Warnings error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch warnings.' }, { quoted: message });
    }
}

module.exports = warningsCommand;
