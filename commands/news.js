/**
 * ScottyMd — .news command
 * Fetches latest news headlines (free RSS feed, no API key needed)
 */
const axios = require('axios');

async function newsCommand(sock, chatId, message, args) {
    try {
        const topic = args.join(' ').trim() || 'world';
        await sock.sendMessage(chatId, { text: `📰 Fetching latest news on *${topic}*...` }, { quoted: message });

        // Using BBC RSS feed (free, no key)
        const feeds = {
            world:       'http://feeds.bbci.co.uk/news/world/rss.xml',
            tech:        'http://feeds.bbci.co.uk/news/technology/rss.xml',
            sports:      'http://feeds.bbci.co.uk/sport/rss.xml',
            africa:      'http://feeds.bbci.co.uk/news/world/africa/rss.xml',
            business:    'http://feeds.bbci.co.uk/news/business/rss.xml',
            health:      'http://feeds.bbci.co.uk/news/health/rss.xml',
        };

        const feedUrl = feeds[topic.toLowerCase()] || feeds['world'];
        const response = await axios.get(feedUrl, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });

        // Parse RSS XML manually
        const xml = response.data;
        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
        const headlines = items.slice(0, 5).map(item => {
            const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
                || item.match(/<title>(.*?)<\/title>/)?.[1] || 'No title';
            const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
                || item.match(/<description>(.*?)<\/description>/)?.[1] || '';
            const cleanDesc = desc.replace(/<[^>]+>/g, '').trim().slice(0, 100);
            return { title: title.trim(), desc: cleanDesc };
        });

        if (!headlines.length) {
            return await sock.sendMessage(chatId, { text: '❌ No news found. Try: world, tech, sports, africa, business, health' }, { quoted: message });
        }

        let text = `📰 *Latest ${topic.charAt(0).toUpperCase() + topic.slice(1)} News*\n`;
        text += `_Powered by BBC News_\n`;
        text += '━━━━━━━━━━━━━━━\n\n';

        headlines.forEach((h, i) => {
            text += `*${i + 1}.* ${h.title}\n`;
            if (h.desc) text += `_${h.desc}..._\n`;
            text += '\n';
        });

        text += `_© @Scottymd_`;

        await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (e) {
        console.error('News error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ Could not fetch news. Try: .news world | .news tech | .news sports | .news africa'
        }, { quoted: message });
    }
}

module.exports = newsCommand;
