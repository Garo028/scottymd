/**
 * ScottyMd — .nameinfo command
 * Get info about a name (age, gender, nationality prediction)
 * © @Scottymd
 */
const axios = require('axios');

async function nameInfoCommand(sock, chatId, message, args) {
    try {
        const name = args.join(' ').trim();
        if (!name) return await sock.sendMessage(chatId, { text: '❌ Usage: .nameinfo <name>\nExample: .nameinfo Scotty' }, { quoted: message });

        const [ageRes, genderRes, nationRes] = await Promise.allSettled([
            axios.get(`https://api.agify.io/?name=${encodeURIComponent(name)}`, { timeout: 8000 }),
            axios.get(`https://api.genderize.io/?name=${encodeURIComponent(name)}`, { timeout: 8000 }),
            axios.get(`https://api.nationalize.io/?name=${encodeURIComponent(name)}`, { timeout: 8000 }),
        ]);

        const age      = ageRes.status === 'fulfilled' ? ageRes.value.data.age : '?';
        const gender   = genderRes.status === 'fulfilled' ? genderRes.value.data.gender : '?';
        const gConf    = genderRes.status === 'fulfilled' ? Math.round(genderRes.value.data.probability * 100) : 0;
        const nation   = nationRes.status === 'fulfilled' ? nationRes.value.data.country?.[0]?.country_id : '?';

        await sock.sendMessage(chatId, {
            text: `👤 *Name Info: ${name}*\n\n🎂 Predicted Age: *${age}*\n⚧ Gender: *${gender}* (${gConf}% confidence)\n🌍 Top Nationality: *${nation}*\n\n_Note: These are statistical predictions, not facts._\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Name info failed.' }, { quoted: message });
    }
}
module.exports = nameInfoCommand;
