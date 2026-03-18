/**
 * ScottyMd — .steal command
 * Adds a sticker from another bot / source to your pack
 * © @Scottymd
 */
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const settings = require('../settings');

async function stealCommand(sock, chatId, message, args) {
    try {
        const quoted  = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const msg     = quoted || message.message;
        const stickerMsg = msg?.stickerMessage;

        if (!stickerMsg) {
            return await sock.sendMessage(chatId, {
                text: '❌ Reply to a sticker with *.steal* to add it to your pack.\n\nYou can also add a custom name:\n.steal MyPack Author'
            }, { quoted: message });
        }

        const packname = args[0] || settings.packname;
        const author   = args[1] || settings.author;

        await sock.sendMessage(chatId, { text: '⏳ Stealing sticker...' }, { quoted: message });

        const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        await sock.sendMessage(chatId, {
            sticker: buffer,
            packname,
            author
        }, { quoted: message });

    } catch (e) {
        console.error('Steal error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to steal sticker.' }, { quoted: message });
    }
}
module.exports = stealCommand;
