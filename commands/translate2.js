/**
 * ScottyMd — .trs command (auto-detect + translate)
 * Translate with auto language detection
 * © @Scottymd
 */
const axios = require('axios');

async function autoTranslateCommand(sock, chatId, message, args) {
    try {
        // .trs <lang> or reply to message with .trs en
        const targetLang = args[0]?.toLowerCase();
        if (!targetLang) return await sock.sendMessage(chatId, { text: '❌ Usage: .trs <lang>\nExample: .trs en\n.trs fr Hello World\n\nCodes: en es fr de pt ar zh ja hi sw' }, { quoted: message });

        const ctx    = message.message?.extendedTextMessage?.contextInfo;
        const qText  = ctx?.quotedMessage?.conversation || ctx?.quotedMessage?.extendedTextMessage?.text;
        const rawText = args.slice(1).join(' ') || qText;

        if (!rawText) return await sock.sendMessage(chatId, { text: '❌ Reply to a message with .trs <lang> or provide text: .trs en Hello' }, { quoted: message });

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(rawText)}`;
        const res = await axios.get(url, { timeout: 10000 });

        let translated = '';
        for (const chunk of res.data[0]) { if (chunk[0]) translated += chunk[0]; }
        const detected = res.data[2] || 'auto';

        await sock.sendMessage(chatId, {
            text: `🌐 *Translation*\n\n🔤 From: ${detected.toUpperCase()} → ${targetLang.toUpperCase()}\n\n*Original:*\n${rawText}\n\n*Translated:*\n${translated}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Translation failed.' }, { quoted: message });
    }
}
module.exports = autoTranslateCommand;
