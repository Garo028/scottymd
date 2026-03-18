/**
 * ScottyMd — .define command
 * Look up word definitions
 * © @Scottymd
 */
const axios = require('axios');

async function defineCommand(sock, chatId, message, args) {
    try {
        const word = args[0]?.trim();
        if (!word) return await sock.sendMessage(chatId, { text: '❌ Usage: .define <word>\nExample: .define eloquent' }, { quoted: message });

        await sock.sendMessage(chatId, { text: `📖 Looking up *${word}*...` }, { quoted: message });

        const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 10000 });
        const data = res.data[0];
        const meaning = data.meanings[0];
        const def = meaning.definitions[0];

        let text = `📖 *${data.word}*`;
        if (data.phonetic) text += ` _(${data.phonetic})_`;
        text += `\n\n🏷️ *Part of speech:* ${meaning.partOfSpeech}`;
        text += `\n\n📝 *Definition:*\n${def.definition}`;
        if (def.example) text += `\n\n💬 *Example:*\n_"${def.example}"_`;
        if (def.synonyms?.length) text += `\n\n🔄 *Synonyms:* ${def.synonyms.slice(0, 5).join(', ')}`;
        text += `\n\n_© @Scottymd_`;

        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ Word not found. Make sure it's spelled correctly.` }, { quoted: message });
    }
}
module.exports = defineCommand;
