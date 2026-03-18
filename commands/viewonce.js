/**
 * ScottyMd — .vv command
 * Reveals / forwards view-once messages so you can see them again
 * © @Scottymd
 */
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewOnceCommand(sock, chatId, message) {
    try {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;

        if (!quoted) {
            return await sock.sendMessage(chatId, {
                text: '❌ Reply to a view-once message with *.vv*'
            }, { quoted: message });
        }

        // Detect view-once message type
        const voMsg =
            quoted?.viewOnceMessage?.message ||
            quoted?.viewOnceMessageV2?.message ||
            quoted?.viewOnceMessageV2Extension?.message ||
            quoted;

        const imgMsg   = voMsg?.imageMessage;
        const vidMsg   = voMsg?.videoMessage;
        const audioMsg = voMsg?.audioMessage;

        if (!imgMsg && !vidMsg && !audioMsg) {
            return await sock.sendMessage(chatId, {
                text: '❌ That does not appear to be a view-once media message.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: '🔓 Revealing view-once media...' }, { quoted: message });

        let mediaType, mediaMsg;
        if (imgMsg)   { mediaType = 'image'; mediaMsg = imgMsg; }
        else if (vidMsg)  { mediaType = 'video'; mediaMsg = vidMsg; }
        else          { mediaType = 'audio'; mediaMsg = audioMsg; }

        const stream = await downloadContentFromMessage(mediaMsg, mediaType);
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        const caption = `🔓 *View Once revealed*\n_© @Scottymd_`;

        if (mediaType === 'image') {
            await sock.sendMessage(chatId, { image: buffer, caption }, { quoted: message });
        } else if (mediaType === 'video') {
            await sock.sendMessage(chatId, { video: buffer, caption }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: mediaMsg.ptt || false
            }, { quoted: message });
        }

    } catch (e) {
        console.error('ViewOnce error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ Could not reveal view-once message. It may have already expired.'
        }, { quoted: message });
    }
}

module.exports = viewOnceCommand;
