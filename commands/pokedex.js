/** ScottyMd — .pokemon pokedex command © ScottyMd by Scotty */
const axios = require('axios');
async function pokemonCommand(sock, chatId, message, args) {
    try {
        const name = args.join(' ').trim().toLowerCase().replace(/\s+/g,'-');
        if (!name) return await sock.sendMessage(chatId, { text: '❌ Usage: .pokemon <name>\nExample: .pokemon pikachu' }, { quoted: message });
        const res  = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`, { timeout: 10000 });
        const p    = res.data;
        const types = p.types.map(t=>t.type.name).join(', ');
        const stats = p.stats.map(s=>`${s.stat.name}: ${s.base_stat}`).join('\n');
        const spriteUrl = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default;
        const text = `⚡ *${p.name.toUpperCase()}* #${p.id}\n\n🏷️ Types: ${types}\n📏 Height: ${p.height/10}m\n⚖️ Weight: ${p.weight/10}kg\n\n📊 *Base Stats:*\n${stats}\n\n_© ScottyMd_`;
        if (spriteUrl) {
            const buf = await axios.get(spriteUrl, { responseType: 'arraybuffer', timeout: 8000 }).then(r=>Buffer.from(r.data)).catch(()=>null);
            if (buf) return await sock.sendMessage(chatId, { image: buf, caption: text }, { quoted: message });
        }
        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Pokemon not found.' }, { quoted: message }); }
}
module.exports = pokemonCommand;
