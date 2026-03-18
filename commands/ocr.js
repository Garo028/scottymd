/**
 * ScottyMd — .ocr command
 * Extract text from an image (OCR)
 * © @Scottymd
 */
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');

async function ocrCommand(sock, chatId, message) {
    try {
        const quoted   = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imgMsg   = message.message?.imageMessage || quoted?.imageMessage;
        if (!imgMsg) return await sock.sendMessage(chatId, { text: '❌ Reply to an image with .ocr to extract text.' }, { quoted: message });

        await sock.sendMessage(chatId, { text: '🔍 Extracting text from image...' }, { quoted: message });

        const stream = await downloadContentFromMessage(imgMsg, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        // Using OCR.space free API
        const form = new FormData();
        form.append('file', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
        form.append('apikey', 'K85540229988957');
        form.append('language', 'eng');
        form.append('isOverlayRequired', 'false');

        const res  = await axios.post('https://api.ocr.space/parse/image', form, {
            headers: form.getHeaders(), timeout: 30000
        });
        const text = res.data?.ParsedResults?.[0]?.ParsedText?.trim();

        if (!text) return await sock.sendMessage(chatId, { text: '❌ No text found in image.' }, { quoted: message });

        await sock.sendMessage(chatId, {
            text: `📝 *Extracted Text:*\n\n${text}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ OCR failed: ' + e.message }, { quoted: message });
    }
}
module.exports = ocrCommand;
