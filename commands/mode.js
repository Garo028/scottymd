/**
 * ScottyMd — .mode command (FIXED)
 * Switch public/private mode — works for owner
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender }  = require('../lib/getSender');

const FILE = './data/mode.json';
function getMode()   { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { mode: 'public' }; } }
function saveMode(d) { try { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); } catch {} }

async function modeCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        if (!isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Only the bot owner can change mode.' }, { quoted: message });
        }

        const current = getMode().mode;
        const sub     = args[0]?.toLowerCase();

        if (!sub) {
            return await sock.sendMessage(chatId, {
                text: `🤖 *Bot Mode*\n\nCurrent: *${current.toUpperCase()}*\n\n*.mode public* — Everyone can use the bot\n*.mode private* — Only owner can use the bot\n\n_© ScottyMd by Scotty_`
            }, { quoted: message });
        }

        if (!['public', 'private'].includes(sub)) {
            return await sock.sendMessage(chatId, { text: '❌ Use: .mode public OR .mode private' }, { quoted: message });
        }

        saveMode({ mode: sub });
        sock.public = (sub === 'public');

        await sock.sendMessage(chatId, {
            text: `✅ Bot mode set to *${sub.toUpperCase()}*\n\n${sub === 'public' ? '🌍 Everyone can use the bot.' : '🔒 Only owner can use the bot.'}\n\n_© ScottyMd by Scotty_`
        }, { quoted: message });

    } catch (e) {
        console.error('Mode error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed: ' + e.message }, { quoted: message });
    }
}

module.exports = { modeCommand, getMode };
