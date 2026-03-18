/**
 * ScottyMd — .word command
 * Word of the day with definition
 * © @Scottymd
 */
const axios = require('axios');

async function wordOfDayCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://wordsapiv1.p.rapidapi.com/words/?random=true&hasDetails=definitions', {
            headers: { 'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com', 'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY' },
            timeout: 8000
        });
        const word = res.data?.word;
        const def  = res.data?.results?.[0]?.definition;
        if (!word) throw new Error('no word');
        await sock.sendMessage(chatId, {
            text: `📚 *Word of the Day*\n\n🔤 *${word.toUpperCase()}*\n📝 ${def || 'Definition not available'}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch {
        // Fallback — curated words
        const words = [
            { word: 'EPHEMERAL', def: 'Lasting for a very short time; transitory.' },
            { word: 'SERENDIPITY', def: 'The occurrence of events by chance in a happy or beneficial way.' },
            { word: 'MELLIFLUOUS', def: 'Sweet or musical; pleasant to hear.' },
            { word: 'SONDER', def: 'The realization that each passerby has a life as vivid and complex as your own.' },
            { word: 'RESILIENCE', def: 'The capacity to recover quickly from difficulties; toughness.' },
            { word: 'ELOQUENT', def: 'Fluent or persuasive in speaking or writing.' },
            { word: 'PERSPICACIOUS', def: 'Having a ready insight into things; shrewd.' },
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        await sock.sendMessage(chatId, {
            text: `📚 *Word of the Day*\n\n🔤 *${w.word}*\n📝 ${w.def}\n\n_© @Scottymd_`
        }, { quoted: message });
    }
}
module.exports = wordOfDayCommand;
