/**
 * ScottyMd — .level / .rank command
 * XP leveling system for group members
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const FILE = './data/levels.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }

function getXpNeeded(level) { return level * 100; }
function getLevel(xp) { let l = 1; while (xp >= getXpNeeded(l)) { xp -= getXpNeeded(l); l++; } return l; }

function addXp(groupId, userId, xp = 5) {
    const data = getData();
    if (!data[groupId]) data[groupId] = {};
    if (!data[groupId][userId]) data[groupId][userId] = { xp: 0, messages: 0 };
    data[groupId][userId].xp += xp;
    data[groupId][userId].messages = (data[groupId][userId].messages || 0) + 1;
    saveData(data);
}

async function levelCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const { getSender } = require('../lib/getSender');
        const target = mentioned[0] || getSender(sock, message);
        const data = getData();
        const info = data[chatId]?.[target] || { xp: 0, messages: 0 };
        const level = getLevel(info.xp);
        const needed = getXpNeeded(level);
        let xpInLevel = info.xp;
        for (let l = 1; l < level; l++) xpInLevel -= getXpNeeded(l);
        const bar = '█'.repeat(Math.round(xpInLevel/needed*10)) + '░'.repeat(10 - Math.round(xpInLevel/needed*10));
        await sock.sendMessage(chatId, {
            text: `📊 *Level Stats*\n👤 @${target.split('@')[0]}\n\n🏆 Level: ${level}\n⭐ XP: ${info.xp}\n💬 Messages: ${info.messages}\n\n${bar} ${xpInLevel}/${needed} XP\n\n_© ScottyMd by Scotty_`,
            mentions: [target]
        }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}

module.exports = { levelCommand, addXp };
