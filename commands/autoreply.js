/**
 * ScottyMd — .autoreply command (FIXED)
 * Auto-replies to DMs when away
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/autoreply.json';

function getData() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return { enabled: false, message: "Hi! I'm currently away. I'll get back to you soon.\n\n_Automated reply — ScottyMd_" }; }
}
function saveData(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

const repliedTo = new Set();

async function autoReplyCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);

        if (!isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only the bot owner can configure autoreply.'
            }, { quoted: message });
        }

        const data = getData();
        const sub  = args[0]?.toLowerCase();

        if (!sub || sub === 'status') {
            return await sock.sendMessage(chatId, {
                text: `🤖 *Auto Reply*\n\nStatus: ${data.enabled ? '✅ ON' : '❌ OFF'}\nMessage:\n_${data.message}_\n\n*.autoreply on* — Enable\n*.autoreply off* — Disable\n*.autoreply set <message>* — Set custom message\n*.autoreply reset* — Reset reply tracker\n\n_© ScottyMd by Scotty_`
            }, { quoted: message });
        }

        if (sub === 'on') {
            data.enabled = true;
            saveData(data);
            repliedTo.clear();
            return await sock.sendMessage(chatId, { text: '✅ Auto-reply *enabled*!' }, { quoted: message });
        }

        if (sub === 'off') {
            data.enabled = false;
            saveData(data);
            return await sock.sendMessage(chatId, { text: '❌ Auto-reply *disabled*.' }, { quoted: message });
        }

        if (sub === 'set') {
            const msg = args.slice(1).join(' ').trim();
            if (!msg) return await sock.sendMessage(chatId, { text: '❌ Usage: .autoreply set <your message>' }, { quoted: message });
            data.message = msg;
            data.enabled = true;
            saveData(data);
            return await sock.sendMessage(chatId, {
                text: `✅ Auto-reply message set!\n\n_${msg}_`
            }, { quoted: message });
        }

        if (sub === 'reset') {
            repliedTo.clear();
            return await sock.sendMessage(chatId, { text: '✅ Reply tracker reset.' }, { quoted: message });
        }

    } catch (e) {
        console.error('Autoreply error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed: ' + e.message }, { quoted: message });
    }
}

async function handleAutoReply(sock, message) {
    try {
        const data = getData();
        if (!data.enabled) return;
        const chatId = message.key.remoteJid;
        if (chatId?.endsWith('@g.us')) return;
        if (message.key.fromMe) return;
        if (chatId === 'status@broadcast') return;
        if (repliedTo.has(chatId)) return;
        repliedTo.add(chatId);
        await sock.sendMessage(chatId, { text: data.message }, { quoted: message });
    } catch {}
}

module.exports = { autoReplyCommand, handleAutoReply };
