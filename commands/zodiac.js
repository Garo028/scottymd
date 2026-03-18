/**
 * ScottyMd — .zodiac command
 * Daily horoscope for any zodiac sign
 * © @Scottymd
 */
const axios = require('axios');

const SIGNS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

async function zodiacCommand(sock, chatId, message, args) {
    try {
        const sign = args[0]?.toLowerCase();
        if (!sign || !SIGNS.includes(sign)) {
            return await sock.sendMessage(chatId, {
                text: `🔮 *Zodiac Signs:*\n\n${SIGNS.map(s => `• ${s}`).join('\n')}\n\n*Usage:* .zodiac aries\n\n_© @Scottymd_`
            }, { quoted: message });
        }
        const res = await axios.get(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`, { timeout: 10000 });
        const data = res.data?.data;
        if (!data) return await sock.sendMessage(chatId, { text: '❌ Could not fetch horoscope.' }, { quoted: message });
        await sock.sendMessage(chatId, {
            text: `🔮 *${sign.toUpperCase()} — Daily Horoscope*\n\n${data.horoscope_data}\n\n📅 Date: ${data.date}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Horoscope failed. Try: .zodiac aries' }, { quoted: message });
    }
}
module.exports = zodiacCommand;
