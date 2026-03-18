/**
 * ScottyMd — .number command
 * Fun facts about numbers
 * © @Scottymd
 */
const axios = require('axios');

async function numberCommand(sock, chatId, message, args) {
    try {
        const num  = args[0] || 'random';
        const type = args[1] || 'trivia';
        const url  = num === 'random'
            ? `http://numbersapi.com/random/${type}`
            : `http://numbersapi.com/${num}/${type}`;
        const res = await axios.get(url, { timeout: 8000 });
        await sock.sendMessage(chatId, {
            text: `🔢 *Number Fact*\n\n${res.data}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Could not fetch number fact.' }, { quoted: message });
    }
}
module.exports = numberCommand;
