/**
 * ScottyMd — .wiki command
 * Search Wikipedia
 * © @Scottymd
 */
const axios = require('axios');

async function wikiCommand(sock, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        if (!query) return await sock.sendMessage(chatId, { text: '❌ Usage: .wiki <topic>\nExample: .wiki Albert Einstein' }, { quoted: message });

        await sock.sendMessage(chatId, { text: `🔍 Searching Wikipedia for *${query}*...` }, { quoted: message });

        const res = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(query), { timeout: 10000 });
        const data = res.data;

        if (data.type === 'disambiguation') {
            return await sock.sendMessage(chatId, { text: `⚠️ *${query}* has multiple meanings. Please be more specific.\nExample: .wiki Albert Einstein physicist` }, { quoted: message });
        }

        const summary = data.extract?.slice(0, 800) || 'No summary available.';
        const url     = data.content_urls?.desktop?.page || '';

        const text = `📚 *${data.title}*\n\n${summary}${data.extract?.length > 800 ? '...' : ''}\n\n🔗 ${url}\n\n_© @Scottymd_`;

        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ No Wikipedia article found for *${args.join(' ')}*` }, { quoted: message });
    }
}
module.exports = wikiCommand;
