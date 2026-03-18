/**
 * ScottyMd — .score command
 * Get live sports scores (football/soccer)
 * © @Scottymd
 */
const axios = require('axios');

async function scoreCommand(sock, chatId, message, args) {
    try {
        await sock.sendMessage(chatId, { text: '⚽ Fetching live scores...' }, { quoted: message });
        const res = await axios.get('https://www.scorebat.com/video-api/v3/feed/?token=', { timeout: 10000 });
        const matches = res.data?.response?.slice(0, 5);
        if (!matches?.length) return await sock.sendMessage(chatId, { text: '❌ No live matches found right now.' }, { quoted: message });

        let text = `⚽ *Latest Football Results*\n\n`;
        for (const m of matches) {
            text += `🏆 ${m.competition}\n📅 ${m.date?.slice(0, 10)}\n⚽ ${m.title}\n\n`;
        }
        text += `_© @Scottymd_`;
        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Could not fetch scores right now.' }, { quoted: message });
    }
}
module.exports = scoreCommand;
