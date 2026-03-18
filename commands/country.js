/**
 * ScottyMd — .country command
 * Get info about any country
 * © @Scottymd
 */
const axios = require('axios');

async function countryCommand(sock, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        if (!query) return await sock.sendMessage(chatId, { text: '❌ Usage: .country <name>\nExample: .country Zimbabwe' }, { quoted: message });

        const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`, { timeout: 10000 });
        const c = res.data[0];

        const capital    = c.capital?.[0] || 'N/A';
        const population = c.population?.toLocaleString() || 'N/A';
        const region     = c.region || 'N/A';
        const subregion  = c.subregion || 'N/A';
        const currency   = Object.values(c.currencies || {})[0];
        const currStr    = currency ? `${currency.name} (${currency.symbol})` : 'N/A';
        const languages  = Object.values(c.languages || {}).join(', ') || 'N/A';
        const flag       = c.flag || c.flags?.emoji || '';
        const area       = c.area?.toLocaleString() || 'N/A';
        const timezone   = c.timezones?.[0] || 'N/A';

        const text = `${flag} *${c.name.common}*\n_(${c.name.official})_\n\n🏛️ Capital: ${capital}\n🌍 Region: ${region} › ${subregion}\n👥 Population: ${population}\n📐 Area: ${area} km²\n💰 Currency: ${currStr}\n🗣️ Languages: ${languages}\n🕐 Timezone: ${timezone}\n\n_© @Scottymd_`;

        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Country not found. Check spelling and try again.' }, { quoted: message });
    }
}
module.exports = countryCommand;
