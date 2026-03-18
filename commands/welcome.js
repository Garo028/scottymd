/**
 * ScottyMd — .welcome (FIXED)
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/welcome.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }

async function welcomeCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ You are not an admin.' }, { quoted: message });
        const data = getData(); const sub = args[0]?.toLowerCase();
        if (!sub || sub === 'status') {
            return await sock.sendMessage(chatId, { text: `*Welcome Settings*\nStatus: ${data[chatId]?.enabled ? '✅ ON':'❌ OFF'}\nMessage: _${data[chatId]?.message||'Default'}_\n\n.welcome on\n.welcome off\n.welcome set <message>\n_Use @user as placeholder_` }, { quoted: message });
        }
        if (sub === 'on') { data[chatId] = {...(data[chatId]||{}), enabled: true}; saveData(data); return await sock.sendMessage(chatId, { text: '✅ Welcome messages enabled!' }, { quoted: message }); }
        if (sub === 'off') { data[chatId] = {...(data[chatId]||{}), enabled: false}; saveData(data); return await sock.sendMessage(chatId, { text: '❌ Welcome messages disabled.' }, { quoted: message }); }
        if (sub === 'set') {
            const msg = args.slice(1).join(' ');
            if (!msg) return await sock.sendMessage(chatId, { text: '❌ Usage: .welcome set Welcome @user!' }, { quoted: message });
            data[chatId] = {...(data[chatId]||{}), message: msg, enabled: true}; saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Welcome message set!\n_${msg}_` }, { quoted: message });
        }
    } catch (e) { console.error('Welcome error:', e.message); }
}

async function handleJoinEvent(sock, groupId, participants) {
    try {
        const data = getData(); const cfg = data[groupId];
        if (!cfg?.enabled) return;
        const meta = await sock.groupMetadata(groupId);
        for (const p of participants) {
            const num = p.split('@')[0];
            let msg = cfg.message || `👋 Welcome @${num} to *${meta.subject}*! 🎉`;
            msg = msg.replace(/@user/gi, `@${num}`);
            await sock.sendMessage(groupId, { text: msg, mentions: [p] });
        }
    } catch (e) { console.error('handleJoinEvent error:', e.message); }
}

module.exports = { welcomeCommand, handleJoinEvent };
