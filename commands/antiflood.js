/**
 * ScottyMd — .antiflood command
 * Detects and removes members flooding same message
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/antiflood.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }
const msgTrack = new Map();

async function antifloodCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        const data = getData(); const sub = (args[0]||'').toLowerCase();
        if (!sub) return await sock.sendMessage(chatId, { text: `🛡️ *Anti-Flood*\nStatus: ${data[chatId]?.enabled ? '✅ ON':'❌ OFF'}\n\n.antiflood on\n.antiflood off` }, { quoted: message });
        if (sub === 'on') { data[chatId] = {...(data[chatId]||{}), enabled: true}; saveData(data); return await sock.sendMessage(chatId, { text: '✅ Anti-Flood enabled!' }, { quoted: message }); }
        if (sub === 'off') { data[chatId] = {...(data[chatId]||{}), enabled: false}; saveData(data); return await sock.sendMessage(chatId, { text: '❌ Anti-Flood disabled.' }, { quoted: message }); }
    } catch (e) { console.error('Antiflood error:', e.message); }
}

async function handleFloodDetection(sock, chatId, senderId, text) {
    try {
        if (!chatId.endsWith('@g.us')) return;
        const data = getData(); if (!data[chatId]?.enabled) return;
        if (await isAdmin(sock, chatId, senderId) || isOwnerOrSudo(senderId)) return;
        const key = `${chatId}_${senderId}`;
        const entry = msgTrack.get(key) || { lastMsg: '', count: 0, ts: Date.now() };
        const now = Date.now();
        if (now - entry.ts > 10000) { msgTrack.set(key, { lastMsg: text, count: 1, ts: now }); return; }
        if (entry.lastMsg === text) {
            entry.count++;
            if (entry.count >= 3) {
                msgTrack.delete(key);
                await sock.sendMessage(chatId, { text: `⚠️ @${senderId.split('@')[0]} stop flooding the same message!`, mentions: [senderId] });
                try { await sock.groupParticipantsUpdate(chatId, [senderId], 'remove'); } catch {}
                return;
            }
        } else { entry.count = 1; entry.lastMsg = text; }
        entry.ts = now;
        msgTrack.set(key, entry);
    } catch {}
}

module.exports = { antifloodCommand, handleFloodDetection };
