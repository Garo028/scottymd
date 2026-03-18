/**
 * ScottyMd — .filter command
 * Auto-respond to trigger words in groups
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/filters.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }

async function filterCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        const sub = (args[0]||'').toLowerCase();
        const data = getData(); if (!data[chatId]) data[chatId] = {};
        if (!sub || sub === 'list') {
            const filters = Object.keys(data[chatId]||{});
            return await sock.sendMessage(chatId, { text: filters.length ? `📋 *Active Filters:*\n\n${filters.map(f=>`• ${f}`).join('\n')}\n\n_© ScottyMd_` : '📋 No filters set.\nUse: .filter add <trigger> | <response>' }, { quoted: message });
        }
        if (sub === 'add') {
            const rest = args.slice(1).join(' ');
            const parts = rest.split('|').map(s=>s.trim());
            if (parts.length < 2) return await sock.sendMessage(chatId, { text: '❌ Usage: .filter add <trigger> | <response>' }, { quoted: message });
            data[chatId][parts[0].toLowerCase()] = parts[1]; saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Filter added!\nTrigger: *${parts[0]}*\nResponse: _${parts[1]}_` }, { quoted: message });
        }
        if (sub === 'del' || sub === 'remove') {
            const trigger = args.slice(1).join(' ').toLowerCase();
            if (!data[chatId]?.[trigger]) return await sock.sendMessage(chatId, { text: `❌ Filter *${trigger}* not found.` }, { quoted: message });
            delete data[chatId][trigger]; saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Filter *${trigger}* removed.` }, { quoted: message });
        }
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}

async function handleFilterResponse(sock, chatId, text) {
    try {
        const data = getData(); const filters = data[chatId];
        if (!filters) return;
        const lower = text.toLowerCase();
        for (const [trigger, response] of Object.entries(filters)) {
            if (lower.includes(trigger)) {
                await sock.sendMessage(chatId, { text: response });
                return;
            }
        }
    } catch {}
}

module.exports = { filterCommand, handleFilterResponse };
