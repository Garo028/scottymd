/**
 * ScottyMd - .antilink command
 * Detects and deletes WhatsApp/website links posted by non-admins
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');
const isOwnerOrSudo = require('../lib/isOwner');

const ANTILINK_FILE = './data/antilink.json';

// Common link patterns
const LINK_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|io|xyz|co|me|gg|chat|link|info|tv|live)[^\s]*)/gi;
const WA_LINK_REGEX = /chat\.whatsapp\.com\/[a-zA-Z0-9]+/gi;

function getAntilinkData() {
    try {
        return JSON.parse(fs.readFileSync(ANTILINK_FILE, 'utf8'));
    } catch {
        return {};
    }
}

function saveAntilinkData(data) {
    fs.writeFileSync(ANTILINK_FILE, JSON.stringify(data, null, 2));
}

async function antilinkCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in a group.'
            }, { quoted: message });
        }

        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only admins can change antilink settings.'
            }, { quoted: message });
        }

        const data = getAntilinkData();
        const sub = args[0]?.toLowerCase();

        if (!sub || sub === 'status') {
            const status = data[chatId]?.enabled ? '✅ ON' : '❌ OFF';
            const mode = data[chatId]?.mode || 'delete';
            return await sock.sendMessage(chatId, {
                text: `*Antilink Settings*\n\nStatus: ${status}\nMode: ${mode}\n\n*Usage:*\n.antilink on\n.antilink off\n.antilink mode delete _(just delete)_\n.antilink mode warn _(warn then kick)_`
            }, { quoted: message });
        }

        if (sub === 'on') {
            data[chatId] = { ...data[chatId], enabled: true };
            saveAntilinkData(data);
            return await sock.sendMessage(chatId, {
                text: '✅ Antilink *enabled*! Links from non-admins will be deleted.'
            }, { quoted: message });
        }

        if (sub === 'off') {
            data[chatId] = { ...data[chatId], enabled: false };
            saveAntilinkData(data);
            return await sock.sendMessage(chatId, {
                text: '❌ Antilink *disabled*.'
            }, { quoted: message });
        }

        if (sub === 'mode') {
            const mode = args[1]?.toLowerCase();
            if (!['delete', 'warn'].includes(mode)) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid mode. Use: .antilink mode delete OR .antilink mode warn'
                }, { quoted: message });
            }
            data[chatId] = { ...data[chatId], mode };
            saveAntilinkData(data);
            return await sock.sendMessage(chatId, {
                text: `✅ Antilink mode set to *${mode}*`
            }, { quoted: message });
        }

    } catch (e) {
        console.error('Antilink command error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to update antilink settings.' }, { quoted: message });
    }
}

// Called for every group message to detect links
async function handleLinkDetection(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return;

        const data = getAntilinkData();
        const config = data[chatId];
        if (!config?.enabled) return;

        const senderId = getSender(sock, message);

        // Don't apply to admins or owner
        if (await isAdmin(sock, chatId, senderId) || isOwnerOrSudo(senderId)) return;

        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption || '';

        const hasLink = LINK_REGEX.test(text) || WA_LINK_REGEX.test(text);
        if (!hasLink) return;

        // Delete the message
        try {
            await sock.sendMessage(chatId, {
                delete: message.key
            });
        } catch { }

        const mode = config.mode || 'delete';

        if (mode === 'delete') {
            await sock.sendMessage(chatId, {
                text: `⚠️ @${senderId.split('@')[0]}, links are not allowed in this group!`,
                mentions: [senderId]
            });
        } else if (mode === 'warn') {
            // Use the warn system
            const warnFile = './data/warnings.json';
            let warnings = {};
            try { warnings = JSON.parse(fs.readFileSync(warnFile, 'utf8')); } catch { }

            const key = `${chatId}_${senderId}`;
            warnings[key] = (warnings[key] || 0) + 1;
            const count = warnings[key];
            const maxWarns = 3;
            fs.writeFileSync(warnFile, JSON.stringify(warnings, null, 2));

            if (count >= maxWarns) {
                await sock.sendMessage(chatId, {
                    text: `⛔ @${senderId.split('@')[0]} was kicked for posting links (${count}/${maxWarns} warnings).`,
                    mentions: [senderId]
                });
                try { await sock.groupParticipantsUpdate(chatId, [senderId], 'remove'); } catch { }
                warnings[key] = 0;
                fs.writeFileSync(warnFile, JSON.stringify(warnings, null, 2));
            } else {
                await sock.sendMessage(chatId, {
                    text: `⚠️ @${senderId.split('@')[0]}, no links allowed! Warning ${count}/${maxWarns}.`,
                    mentions: [senderId]
                });
            }
        }

    } catch (e) {
        console.error('Link detection error:', e.message);
    }
}

module.exports = { antilinkCommand, handleLinkDetection };
