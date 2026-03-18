/**
 * ScottyMd — .anime command
 * Search anime info
 * © @Scottymd
 */
const axios = require('axios');

async function animeCommand(sock, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        if (!query) return await sock.sendMessage(chatId, { text: '❌ Usage: .anime <title>\nExample: .anime Naruto' }, { quoted: message });
        const res   = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`, { timeout: 15000 });
        const anime = res.data?.data?.[0];
        if (!anime) return await sock.sendMessage(chatId, { text: '❌ Anime not found.' }, { quoted: message });

        const text = `🎌 *${anime.title}*\n_(${anime.title_english || 'N/A'})_\n\n📺 Type: ${anime.type}\n⭐ Score: ${anime.score}/10\n📅 Aired: ${anime.aired?.string || 'N/A'}\n🎬 Episodes: ${anime.episodes || '?'}\n📊 Status: ${anime.status}\n🎭 Genres: ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n📝 *Synopsis:*\n${anime.synopsis?.slice(0, 300)}...\n\n_© @Scottymd_`;

        if (anime.images?.jpg?.image_url) {
            const img = await axios.get(anime.images.jpg.image_url, { responseType: 'arraybuffer', timeout: 10000 });
            await sock.sendMessage(chatId, { image: Buffer.from(img.data), caption: text }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text }, { quoted: message });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Anime search failed.' }, { quoted: message });
    }
}
module.exports = animeCommand;
