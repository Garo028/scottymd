/**
 * ScottyMd — .caption command
 * Add custom text caption to an image
 * © @Scottymd
 */
async function captionCommand(sock, chatId, message, args) {
    try {
        const quoted  = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imgMsg  = message.message?.imageMessage || quoted?.imageMessage;

        if (!imgMsg) {
            return await sock.sendMessage(chatId, {
                text: '❌ Reply to an image with .caption <text>\nExample: .caption This is fire 🔥'
            }, { quoted: message });
        }

        const text = args.join(' ').trim();
        if (!text) {
            return await sock.sendMessage(chatId, { text: '❌ Please provide caption text.\nUsage: .caption <your text>' }, { quoted: message });
        }

        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const stream = await downloadContentFromMessage(imgMsg, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        await sock.sendMessage(chatId, {
            image: buffer,
            caption: `${text}\n\n_© @Scottymd_`
        }, { quoted: message });

    } catch (e) {
        console.error('Caption error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to add caption.' }, { quoted: message });
    }
}
module.exports = captionCommand;
