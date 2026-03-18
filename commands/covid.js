/**
 * ScottyMd — .covid command
 * COVID-19 stats for any country
 * © @Scottymd
 */
const axios = require('axios');

async function covidCommand(sock, chatId, message, args) {
    try {
        const country = args.join(' ').trim() || 'world';
        const url = country.toLowerCase() === 'world'
            ? 'https://disease.sh/v3/covid-19/all'
            : `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`;
        const res  = await axios.get(url, { timeout: 10000 });
        const data = res.data;
        if (!data?.cases) return await sock.sendMessage(chatId, { text: '❌ Country not found.' }, { quoted: message });
        await sock.sendMessage(chatId, {
            text: `🦠 *COVID-19 Stats — ${data.country || 'World'}*\n\n🔴 Confirmed: ${data.cases?.toLocaleString()}\n🟢 Recovered: ${data.recovered?.toLocaleString()}\n⚫ Deaths: ${data.deaths?.toLocaleString()}\n🟡 Active: ${data.active?.toLocaleString()}\n\n📅 Updated: ${new Date(data.updated).toLocaleDateString()}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ COVID stats unavailable.' }, { quoted: message });
    }
}
module.exports = covidCommand;
