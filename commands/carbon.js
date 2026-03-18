/**
 * ScottyMd — .carbon command
 * Create a beautiful code snippet image
 * © @Scottymd
 */
const axios = require('axios');

async function carbonCommand(sock, chatId, message, args) {
    try {
        const code = args.join(' ').trim();
        if (!code) return await sock.sendMessage(chatId, { text: '❌ Usage: .carbon <code>\nExample: .carbon console.log("Hello World")' }, { quoted: message });
        await sock.sendMessage(chatId, { text: '⏳ Generating code image...' }, { quoted: message });
        // Using carbonara API
        const res = await axios.post('https://carbonara-42.herokuapp.com/api/cook', {
            code,
            theme: 'one-dark',
            fontFamily: 'Fira Code',
            fontSize: '14px',
            backgroundColor: '#1a1a2e'
        }, { responseType: 'arraybuffer', timeout: 20000 });
        await sock.sendMessage(chatId, {
            image: Buffer.from(res.data),
            caption: `💻 Code Snippet\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Carbon image generation failed.' }, { quoted: message });
    }
}
module.exports = carbonCommand;
