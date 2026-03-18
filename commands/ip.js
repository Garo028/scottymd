/**
 * ScottyMd — .ip command
 * Look up IP address information
 * © @Scottymd
 */
const axios = require('axios');

async function ipCommand(sock, chatId, message, args) {
    try {
        const ip = args[0]?.trim();
        const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
        const res  = await axios.get(url, { timeout: 10000 });
        const d    = res.data;
        if (d.error) return await sock.sendMessage(chatId, { text: `❌ ${d.reason || 'Invalid IP address.'}` }, { quoted: message });

        await sock.sendMessage(chatId, {
            text: `🌐 *IP Lookup*\n\n📍 IP: ${d.ip}\n🏳️ Country: ${d.country_name} (${d.country})\n🏙️ City: ${d.city}\n🗺️ Region: ${d.region}\n📮 Postal: ${d.postal}\n🌍 Timezone: ${d.timezone}\n📡 ISP: ${d.org}\n📐 Lat/Long: ${d.latitude}, ${d.longitude}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ IP lookup failed.' }, { quoted: message });
    }
}
module.exports = ipCommand;
