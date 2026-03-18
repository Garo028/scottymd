/**
 * ScottyMd — .warn (FIXED)
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo  = require('../lib/isOwner');
const { getSender }  = require('../lib/getSender');
const { WARN_COUNT } = require('../config');
const FILE = './data/warnings.json';
function getW() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveW(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }

async function warnCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ You are not an admin.' }, { quoted: message });
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const qp = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (qp && !mentioned.includes(qp)) mentioned.push(qp);
        if (!mentioned.length) return await sock.sendMessage(chatId, { text: '❌ Usage: .warn @user' }, { quoted: message });
        const warnings = getW(); const max = WARN_COUNT || 3;
        for (const u of mentioned) {
            const k = `${chatId}_${u}`; warnings[k] = (warnings[k]||0) + 1; const c = warnings[k]; saveW(warnings);
            if (c >= max) {
                await sock.sendMessage(chatId, { text: `⛔ @${u.split('@')[0]} reached ${c}/${max} warnings and was kicked!`, mentions: [u] });
                try { await sock.groupParticipantsUpdate(chatId, [u], 'remove'); } catch {}
                warnings[k] = 0; saveW(warnings);
            } else {
                await sock.sendMessage(chatId, { text: `⚠️ Warning ${c}/${max}\n@${u.split('@')[0]} has been warned!\n${max-c} more before auto-kick.`, mentions: [u] }, { quoted: message });
            }
        }
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}
module.exports = warnCommand;
