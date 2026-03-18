/**
 * ScottyMd — .toimg / .tovid command
 * Convert a sticker back to image or video
 * © @Scottymd
 */
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function stickerToMediaCommand(sock, chatId, message) {
    try {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const msg    = quoted || message.message;
        const stickerMsg = msg?.stickerMessage;

        if (!stickerMsg) {
            return await sock.sendMessage(chatId, {
                text: '❌ Reply to a sticker with *.toimg* to convert it.\n*.tovid* for animated stickers.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: '⏳ Converting sticker...' }, { quoted: message });

        const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        const isAnimated = stickerMsg.isAnimated;

        if (isAnimated) {
            await sock.sendMessage(chatId, {
                video: buffer,
                caption: '✅ Converted from animated sticker\n_© @Scottymd_'
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                image: buffer,
                caption: '✅ Converted from sticker\n_© @Scottymd_'
            }, { quoted: message });
        }
    } catch (e) {
        console.error('StickerToMedia error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to convert sticker.' }, { quoted: message });
    }
}
module.exports = stickerToMediaCommand;
