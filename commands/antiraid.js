/**
 * ScottyMd — .antiraid command
 * Detects mass joins (raids) and locks the group
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const { isBotAdmin } = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/antiraid.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }
const joinLog = new Map();

async function antiraidCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        const data = getData(); const sub = (args[0]||'').toLowerCase();
        if (!sub) return await sock.sendMessage(chatId, { text: `🛡️ *Anti-Raid*\nStatus: ${data[chatId]?.enabled ? '✅ ON':'❌ OFF'}\nThreshold: ${data[chatId]?.threshold||5} joins in 10s\n\n.antiraid on\n.antiraid off` }, { quoted: message });
        if (sub === 'on') { data[chatId] = {...(data[chatId]||{}), enabled: true}; saveData(data); return await sock.sendMessage(chatId, { text: '✅ Anti-Raid enabled!' }, { quoted: message }); }
        if (sub === 'off') { data[chatId] = {...(data[chatId]||{}), enabled: false}; saveData(data); return await sock.sendMessage(chatId, { text: '❌ Anti-Raid disabled.' }, { quoted: message }); }
    } catch (e) { console.error('Antiraid error:', e.message); }
}

async function handleRaidDetection(sock, groupId, participants) {
    try {
        const data = getData(); if (!data[groupId]?.enabled) return;
        if (!await isBotAdmin(sock, groupId)) return;
        const now = Date.now(); const key = groupId;
        const entry = joinLog.get(key) || { count: 0, ts: now };
        if (now - entry.ts > 10000) { joinLog.set(key, { count: participants.length, ts: now }); return; }
        entry.count += participants.length;
        const threshold = data[groupId]?.threshold || 5;
        if (entry.count >= threshold) {
            joinLog.set(key, { count: 0, ts: now });
            await sock.groupSettingUpdate(groupId, 'announcement');
            await sock.sendMessage(groupId, { text: `🚨 *RAID DETECTED!*\n\n${entry.count} people joined in quick succession.\nGroup has been *locked* automatically.\n\nAdmins please review.\n_© ScottyMd by Scotty_` });
        } else { joinLog.set(key, entry); }
    } catch {}
}

module.exports = { antiraidCommand, handleRaidDetection };
