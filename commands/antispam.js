/**
 * ScottyMd — .antispam command
 * Detects and removes spammers from groups automatically
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const { isBotAdmin } = require('../lib/isAdmin');
const isOwnerOrSudo   = require('../lib/isOwner');
const { getSender }   = require('../lib/getSender');

const FILE      = './data/antispam.json';
const MSG_COUNT = new Map(); // chatId_userId → { count, lastReset }

function getData()    { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; } }
function saveData(d)  { try { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); } catch {} }

async function antispamCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        }

        const data = getData();
        const sub  = (args[0] || '').toLowerCase();

        if (!sub) {
            const cfg    = data[chatId] || {};
            const status = cfg.enabled ? '✅ ON' : '❌ OFF';
            const limit  = cfg.limit || 5;
            const window = cfg.window || 5;
            const action = cfg.action || 'warn';
            return await sock.sendMessage(chatId, {
                text: `🛡️ *Anti-Spam Settings*\n\nStatus: ${status}\nLimit: ${limit} messages\nWindow: ${window} seconds\nAction: ${action}\n\n*.antispam on*\n*.antispam off*\n*.antispam limit <n>* — max messages\n*.antispam window <s>* — time window (seconds)\n*.antispam action warn/kick/mute*\n\n_© ScottyMd by Scotty_`
            }, { quoted: message });
        }

        if (!data[chatId]) data[chatId] = { enabled: false, limit: 5, window: 5, action: 'warn' };

        if (sub === 'on')  { data[chatId].enabled = true;  saveData(data); return await sock.sendMessage(chatId, { text: '✅ Anti-Spam *enabled*!' }, { quoted: message }); }
        if (sub === 'off') { data[chatId].enabled = false; saveData(data); return await sock.sendMessage(chatId, { text: '❌ Anti-Spam *disabled*.' }, { quoted: message }); }

        if (sub === 'limit') {
            const n = parseInt(args[1]);
            if (isNaN(n) || n < 1) return await sock.sendMessage(chatId, { text: '❌ Usage: .antispam limit 5' }, { quoted: message });
            data[chatId].limit = n;
            saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Spam limit set to ${n} messages.` }, { quoted: message });
        }

        if (sub === 'window') {
            const n = parseInt(args[1]);
            if (isNaN(n) || n < 1) return await sock.sendMessage(chatId, { text: '❌ Usage: .antispam window 5' }, { quoted: message });
            data[chatId].window = n;
            saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Spam window set to ${n} seconds.` }, { quoted: message });
        }

        if (sub === 'action') {
            const act = args[1]?.toLowerCase();
            if (!['warn', 'kick', 'mute'].includes(act)) return await sock.sendMessage(chatId, { text: '❌ Action must be: warn, kick, or mute' }, { quoted: message });
            data[chatId].action = act;
            saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Spam action set to *${act}*.` }, { quoted: message });
        }

    } catch (e) {
        console.error('Antispam cmd error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed: ' + e.message }, { quoted: message });
    }
}

// Called on every group message
async function handleSpamDetection(sock, chatId, senderId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return;
        const data = getData();
        const cfg  = data[chatId];
        if (!cfg?.enabled) return;

        // Exempt admins and owner
        if (await isAdmin(sock, chatId, senderId) || isOwnerOrSudo(senderId)) return;

        const now     = Date.now();
        const key     = `${chatId}_${senderId}`;
        const entry   = MSG_COUNT.get(key) || { count: 0, start: now };
        const elapsed = (now - entry.start) / 1000;
        const window  = cfg.window || 5;
        const limit   = cfg.limit  || 5;

        if (elapsed > window) {
            // Reset window
            MSG_COUNT.set(key, { count: 1, start: now });
            return;
        }

        entry.count++;
        MSG_COUNT.set(key, entry);

        if (entry.count >= limit) {
            MSG_COUNT.delete(key); // reset counter

            const action = cfg.action || 'warn';
            const num    = senderId.split('@')[0];

            if (action === 'kick') {
                try { await sock.groupParticipantsUpdate(chatId, [senderId], 'remove'); } catch {}
                await sock.sendMessage(chatId, {
                    text: `⛔ @${num} was *kicked* for spamming (${entry.count} msgs in ${window}s)`,
                    mentions: [senderId]
                });
            } else if (action === 'mute') {
                // Warn + mute suggestion
                await sock.sendMessage(chatId, {
                    text: `🚫 @${num} slow down! You're spamming (${entry.count} msgs in ${window}s). Next time you'll be kicked.`,
                    mentions: [senderId]
                });
            } else {
                await sock.sendMessage(chatId, {
                    text: `⚠️ @${num} stop spamming! (${entry.count} messages in ${window}s). You'll be kicked if it continues.`,
                    mentions: [senderId]
                });
            }
        }
    } catch (e) {
        console.error('Spam detection error:', e.message);
    }
}

module.exports = { antispamCommand, handleSpamDetection };
