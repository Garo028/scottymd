/**
 * ScottyMd — .alwaysonline command
 * Keep bot always appearing online
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender }  = require('../lib/getSender');

const FILE = './data/alwaysonline.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { enabled: false }; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); } catch {} }

let onlineInterval = null;

async function alwaysonlineCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        if (!isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Owner only command.' }, { quoted: message });
        }

        const sub  = (args[0] || '').toLowerCase();
        const data = getData();

        if (!sub) {
            return await sock.sendMessage(chatId, {
                text: `🟢 *Always Online*\n\nStatus: ${data.enabled ? '✅ ON' : '❌ OFF'}\n\n*.alwaysonline on* — Stay always online\n*.alwaysonline off* — Normal presence\n\n_© ScottyMd by Scotty_`
            }, { quoted: message });
        }

        if (sub === 'on') {
            data.enabled = true;
            saveData(data);
            startAlwaysOnline(sock);
            return await sock.sendMessage(chatId, { text: '🟢 Always Online *enabled*! Bot will always appear online.' }, { quoted: message });
        }

        if (sub === 'off') {
            data.enabled = false;
            saveData(data);
            stopAlwaysOnline();
            try { await sock.sendPresenceUpdate('unavailable'); } catch {}
            return await sock.sendMessage(chatId, { text: '⚫ Always Online *disabled*.' }, { quoted: message });
        }

    } catch (e) {
        console.error('AlwaysOnline error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed: ' + e.message }, { quoted: message });
    }
}

function startAlwaysOnline(sock) {
    stopAlwaysOnline();
    // Send online presence every 10 seconds
    onlineInterval = setInterval(async () => {
        try { await sock.sendPresenceUpdate('available'); } catch {}
    }, 10000);
    // Send immediately
    try { sock.sendPresenceUpdate('available'); } catch {}
    console.log('🟢 Always Online started');
}

function stopAlwaysOnline() {
    if (onlineInterval) {
        clearInterval(onlineInterval);
        onlineInterval = null;
    }
}

// Call on bot start to restore state
function initAlwaysOnline(sock) {
    const data = getData();
    if (data.enabled) {
        console.log('🟢 Restoring Always Online...');
        startAlwaysOnline(sock);
    }
}

module.exports = { alwaysonlineCommand, initAlwaysOnline, startAlwaysOnline, stopAlwaysOnline };
