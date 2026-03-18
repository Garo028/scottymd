/**
 * ScottyMd — .movie command
 * Search movie/show info from OMDB
 * © @Scottymd
 */
const axios = require('axios');

async function movieCommand(sock, chatId, message, args) {
    try {
        const title = args.join(' ').trim();
        if (!title) return await sock.sendMessage(chatId, { text: '❌ Usage: .movie <title>\nExample: .movie Avengers' }, { quoted: message });
        // Using OMDB free API
        const res  = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=trilogy`, { timeout: 10000 });
        const m    = res.data;
        if (m.Response === 'False' || !m.Title) return await sock.sendMessage(chatId, { text: `❌ Movie "${title}" not found.` }, { quoted: message });

        const text = `🎬 *${m.Title}* (${m.Year})\n\n🎭 Genre: ${m.Genre}\n⭐ Rating: ${m.imdbRating}/10\n⏱️ Runtime: ${m.Runtime}\n🌍 Language: ${m.Language}\n🏆 Awards: ${m.Awards}\n\n📝 *Plot:*\n${m.Plot}\n\n👥 *Cast:* ${m.Actors}\n🎬 *Director:* ${m.Director}\n\n_© @Scottymd_`;

        if (m.Poster && m.Poster !== 'N/A') {
            try {
                const img = await axios.get(m.Poster, { responseType: 'arraybuffer', timeout: 10000 });
                return await sock.sendMessage(chatId, { image: Buffer.from(img.data), caption: text }, { quoted: message });
            } catch {}
        }
        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Movie search failed.' }, { quoted: message });
    }
}
module.exports = movieCommand;
