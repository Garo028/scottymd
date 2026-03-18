/**
 * ScottyMd — .whois command
 * Domain WHOIS lookup
 * © @Scottymd
 */
const axios = require('axios');

async function whoisCommand(sock, chatId, message, args) {
    try {
        const domain = args[0]?.toLowerCase().replace(/https?:\/\//, '').replace(/\/.*/, '');
        if (!domain) return await sock.sendMessage(chatId, { text: '❌ Usage: .whois <domain>\nExample: .whois google.com' }, { quoted: message });
        const res  = await axios.get(`https://api.whoapi.com/?apikey=demokey&r=whois&domain=${domain}`, { timeout: 10000 });
        const d    = res.data;
        if (!d || d.status !== '0') return await sock.sendMessage(chatId, { text: '❌ WHOIS lookup failed.' }, { quoted: message });

        const created  = d.date_created || 'N/A';
        const expires  = d.date_expires || 'N/A';
        const updated  = d.date_updated || 'N/A';
        const registrar = d.registrar_name || 'N/A';

        await sock.sendMessage(chatId, {
            text: `🔍 *WHOIS: ${domain}*\n\n📅 Created: ${created}\n⏰ Expires: ${expires}\n🔄 Updated: ${updated}\n🏢 Registrar: ${registrar}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ WHOIS failed.' }, { quoted: message });
    }
}
module.exports = whoisCommand;
