/**
 * ScottyMd — .color command
 * Get info about any color hex code
 * © @Scottymd
 */
const axios = require('axios');

async function colorCommand(sock, chatId, message, args) {
    try {
        let hex = (args[0] || '').replace('#', '');
        if (!hex || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
            return await sock.sendMessage(chatId, { text: '❌ Usage: .color <hex>\nExample: .color FF5733' }, { quoted: message });
        }
        const res  = await axios.get(`https://www.thecolorapi.com/id?hex=${hex}`, { timeout: 10000 });
        const data = res.data;
        const text = `🎨 *Color Info*\n\n🏷️ Name: ${data.name.value}\n🔴 Hex: #${hex.toUpperCase()}\n🟢 RGB: ${data.rgb.value}\n🔵 HSL: ${data.hsl.value}\n\n_© @Scottymd_`;
        // Generate color image via placeholder
        const imgUrl = `https://via.placeholder.com/300x300/${hex}/${hex}.png`;
        try {
            const img = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 10000 });
            await sock.sendMessage(chatId, { image: Buffer.from(img.data), caption: text }, { quoted: message });
        } catch {
            await sock.sendMessage(chatId, { text }, { quoted: message });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Color lookup failed.' }, { quoted: message });
    }
}
module.exports = colorCommand;
