/**
 * ScottyMd — .topmembers command
 * Tracks and shows most active group members
 * © @Scottymd
 */
const fs = require('fs');
const FILE = './data/msgcount.json';

function getData() { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); } catch {} }

function incrementCount(groupId, userId) {
    const data = getData();
    if (!data[groupId]) data[groupId] = {};
    data[groupId][userId] = (data[groupId][userId] || 0) + 1;
    saveData(data);
}

async function topMembersCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        }
        const data = getData();
        const groupData = data[chatId] || {};

        if (!Object.keys(groupData).length) {
            return await sock.sendMessage(chatId, {
                text: '📊 No message data yet. Members need to send messages first!'
            }, { quoted: message });
        }

        const sorted = Object.entries(groupData)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        const meta     = await sock.groupMetadata(chatId);
        const mentions = sorted.map(([id]) => id);

        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let text = `📊 *Top Members — ${meta.subject}*\n\n`;

        sorted.forEach(([id, count], i) => {
            text += `${medals[i]} @${id.split('@')[0]} — *${count}* messages\n`;
        });

        text += `\n_© @Scottymd_`;

        await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
    } catch (e) {
        console.error('TopMembers error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to get top members.' }, { quoted: message });
    }
}

module.exports = { topMembersCommand, incrementCount };
