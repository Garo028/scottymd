/**
 * ScottyMd — .gstats command
 * Detailed group statistics
 * © @Scottymd
 */
const fs = require('fs');

async function groupStatsCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });

        const meta   = await sock.groupMetadata(chatId);
        const admins = meta.participants.filter(p => p.admin);
        const members = meta.participants.length;
        const created = new Date(meta.creation * 1000);
        const age     = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));

        let data = {};
        try { data = JSON.parse(fs.readFileSync('./data/msgcount.json', 'utf8')); } catch {}
        const groupData   = data[chatId] || {};
        const totalMsgs   = Object.values(groupData).reduce((a, b) => a + b, 0);
        const mostActive  = Object.entries(groupData).sort(([,a],[,b]) => b-a)[0];

        await sock.sendMessage(chatId, {
            text: `📊 *Group Statistics*\n\n👥 *Members:* ${members}\n⭐ *Admins:* ${admins.length}\n👤 *Regular:* ${members - admins.length}\n\n📅 *Created:* ${created.toDateString()}\n📆 *Age:* ${age} days old\n\n💬 *Total Messages:* ${totalMsgs}\n🏆 *Most Active:* ${mostActive ? `@${mostActive[0].split('@')[0]} (${mostActive[1]} msgs)` : 'N/A'}\n\n🔒 *Messaging:* ${meta.announce ? 'Admins only' : 'All members'}\n\n_© @Scottymd_`,
            mentions: mostActive ? [mostActive[0]] : []
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Group stats failed.' }, { quoted: message });
    }
}
module.exports = groupStatsCommand;
