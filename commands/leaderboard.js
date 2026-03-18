/**
 * ScottyMd — .leaderboard command
 * Shows top members by XP
 * © ScottyMd by Scotty
 */
const fs = require('fs');

async function leaderboardCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
        const data = (() => { try { return JSON.parse(fs.readFileSync('./data/levels.json','utf8')); } catch { return {}; } })();
        const group = data[chatId] || {};
        const sorted = Object.entries(group).sort(([,a],[,b]) => b.xp - a.xp).slice(0, 10);
        if (!sorted.length) return await sock.sendMessage(chatId, { text: '📊 No data yet. Members need to send messages first!' }, { quoted: message });
        const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
        const mentions = sorted.map(([id]) => id);
        let text = `🏆 *XP Leaderboard*\n\n`;
        sorted.forEach(([id, info], i) => { text += `${medals[i]} @${id.split('@')[0]} — *${info.xp} XP*\n`; });
        text += `\n_© ScottyMd by Scotty_`;
        await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}
module.exports = leaderboardCommand;
