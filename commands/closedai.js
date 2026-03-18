/** ScottyMd — .imagine text to image via pollinations.ai © ScottyMd by Scotty */
const axios = require('axios');
async function imagineCommand(sock, chatId, message, args) {
    try {
        const prompt = args.join(' ').trim();
        if (!prompt) return await sock.sendMessage(chatId, { text: '❌ Usage: .imagine <description>\nExample: .imagine a sunset over African plains' }, { quoted: message });
        await sock.sendMessage(chatId, { text: `🎨 Generating image for: _${prompt}_\n⏳ Please wait...` }, { quoted: message });
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        await sock.sendMessage(chatId, { image: Buffer.from(res.data), caption: `🎨 *AI Generated Image*\n📝 Prompt: _${prompt}_\n\n_© ScottyMd_` }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Image generation failed. Try again.' }, { quoted: message }); }
}
module.exports = imagineCommand;
