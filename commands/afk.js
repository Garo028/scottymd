/**
 * ScottyMd — .afk command
 * Mark yourself as AFK — bot auto-notifies when mentioned
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/afk.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }

async function afkCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        const data     = getData();
        const reason   = args.join(' ').trim() || 'No reason given';

        if (data[senderId]?.afk) {
            // Turn off AFK
            delete data[senderId];
            saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Welcome back @${senderId.split('@')[0]}! AFK removed.`, mentions: [senderId] }, { quoted: message });
        }

        data[senderId] = { afk: true, reason, since: Date.now() };
        saveData(data);
        await sock.sendMessage(chatId, {
            text: `😴 @${senderId.split('@')[0]} is now AFK\n📝 Reason: _${reason}_`,
            mentions: [senderId]
        }, { quoted: message });
    } catch (e) { console.error('AFK error:', e.message); }
}

async function handleAfkMention(sock, chatId, message, senderId) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const data = getData();
        for (const u of mentioned) {
            const info = data[u];
            if (!info?.afk) continue;
            const elapsed = Math.round((Date.now() - info.since) / 60000);
            await sock.sendMessage(chatId, {
                text: `😴 @${u.split('@')[0]} is AFK\n📝 Reason: _${info.reason}_\n⏱️ Since: ${elapsed} minute(s) ago`,
                mentions: [u]
            });
        }
    } catch {}
}

module.exports = { afkCommand, handleAfkMention };
