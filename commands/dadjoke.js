/**
 * ScottyMd — .dadjoke command
 * Random dad joke
 * © @Scottymd
 */
const axios = require('axios');

async function dadJokeCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://icanhazdadjoke.com/', {
            headers: { Accept: 'application/json' }, timeout: 8000
        });
        await sock.sendMessage(chatId, {
            text: `👴 *Dad Joke*\n\n_${res.data.joke}_\n\n😂\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ No dad jokes available right now.' }, { quoted: message });
    }
}
module.exports = dadJokeCommand;
