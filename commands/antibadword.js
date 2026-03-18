/**
 * ScottyMd — .antibadword command
 * Auto-deletes messages containing bad words
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const { getSender, getBotJid } = require('../lib/getSender');
const isOwnerOrSudo = require('../lib/isOwner');

const FILE = './data/antibadword.json';

const DEFAULT_BADWORDS = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'damn', 'cunt', 'dick', 'pussy', 'nigga', 'nigger', 'whore', 'slut'];

function getData() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); }
    catch { return {}; }
}
function saveData(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

async function antibadwordCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const senderId = getSender(sock, message);
        if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        }

        const data = getData();
        const sub = args[0]?.toLowerCase();

        if (!sub || sub === 'status') {
            const enabled = data[chatId]?.enabled ? '✅ ON' : '❌ OFF';
            const words = data[chatId]?.words || DEFAULT_BADWORDS;
            return await sock.sendMessage(chatId, {
                text: `*Anti-Badword Settings*\nStatus: ${enabled}\nWords: ${words.length} tracked\n\n.antibadword on\n.antibadword off\n.antibadword add <word>\n.antibadword remove <word>\n.antibadword list`
            }, { quoted: message });
        }
        if (sub === 'on') {
            data[chatId] = { ...data[chatId], enabled: true, words: data[chatId]?.words || DEFAULT_BADWORDS };
            saveData(data);
            return await sock.sendMessage(chatId, { text: '✅ Anti-badword enabled!' }, { quoted: message });
        }
        if (sub === 'off') {
            data[chatId] = { ...data[chatId], enabled: false };
            saveData(data);
            return await sock.sendMessage(chatId, { text: '❌ Anti-badword disabled.' }, { quoted: message });
        }
        if (sub === 'add') {
            const word = args[1]?.toLowerCase();
            if (!word) return await sock.sendMessage(chatId, { text: '❌ Usage: .antibadword add <word>' }, { quoted: message });
            const words = data[chatId]?.words || [...DEFAULT_BADWORDS];
            if (!words.includes(word)) words.push(word);
            data[chatId] = { ...data[chatId], words };
            saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Added "*${word}*" to bad words list.` }, { quoted: message });
        }
        if (sub === 'remove') {
            const word = args[1]?.toLowerCase();
            if (!word) return await sock.sendMessage(chatId, { text: '❌ Usage: .antibadword remove <word>' }, { quoted: message });
            const words = (data[chatId]?.words || DEFAULT_BADWORDS).filter(w => w !== word);
            data[chatId] = { ...data[chatId], words };
            saveData(data);
            return await sock.sendMessage(chatId, { text: `✅ Removed "*${word}*" from bad words list.` }, { quoted: message });
        }
        if (sub === 'list') {
            const words = data[chatId]?.words || DEFAULT_BADWORDS;
            return await sock.sendMessage(chatId, {
                text: `📋 *Bad Words List (${words.length}):*\n\n${words.map(w => `• ${w}`).join('\n')}`
            }, { quoted: message });
        }
    } catch (e) {
        console.error('Antibadword error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to update antibadword settings.' }, { quoted: message });
    }
}

async function handleBadwordDetection(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return;
        const data = getData();
        const config = data[chatId];
        if (!config?.enabled) return;

        const senderId = getSender(sock, message);
        if (await isAdmin(sock, chatId, senderId) || isOwnerOrSudo(senderId)) return;

        const text = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption || ''
        ).toLowerCase();

        const words = config.words || DEFAULT_BADWORDS;
        const found = words.find(w => text.includes(w.toLowerCase()));
        if (!found) return;

        try { await sock.sendMessage(chatId, { delete: message.key }); } catch {}

        await sock.sendMessage(chatId, {
            text: `⚠️ @${senderId.split('@')[0]}, watch your language! Bad words are not allowed here.`,
            mentions: [senderId]
        });
    } catch (e) {
        console.error('Badword detection error:', e.message);
    }
}

module.exports = { antibadwordCommand, handleBadwordDetection };
