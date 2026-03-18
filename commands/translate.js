/**
 * ScottyMd - .tr command
 * Translates text to any language
 */
const axios = require('axios');

// Common language codes reference
const LANG_HINTS = `*Common language codes:*
en - English | es - Spanish
fr - French  | de - German
pt - Portuguese | ar - Arabic
zh - Chinese | ja - Japanese
hi - Hindi   | sw - Swahili
zu - Zulu    | af - Afrikaans`;

async function translateCommand(sock, chatId, message, args) {
    try {
        if (args.length < 2) {
            // Check if replying to a message
            const quotedText = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
                || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;

            if (quotedText && args.length >= 1) {
                // .tr en (reply to message)
                const targetLang = args[0];
                return await doTranslate(sock, chatId, message, quotedText, targetLang);
            }

            return await sock.sendMessage(chatId, {
                text: `❌ Invalid usage.\n\n*Usage:*\n.tr <lang> <text>\n.tr en Hello world\n\nOr reply to a message:\n.tr es\n\n${LANG_HINTS}`
            }, { quoted: message });
        }

        const targetLang = args[0].toLowerCase();
        const text = args.slice(1).join(' ');
        await doTranslate(sock, chatId, message, text, targetLang);

    } catch (e) {
        console.error('Translate error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Translation failed. Please try again.' }, { quoted: message });
    }
}

async function doTranslate(sock, chatId, message, text, targetLang) {
    try {
        await sock.sendMessage(chatId, { text: '🌐 Translating...' }, { quoted: message });

        // Free Google Translate API (unofficial)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await axios.get(url, { timeout: 10000 });
        const data = response.data;

        if (!data || !data[0]) {
            return await sock.sendMessage(chatId, {
                text: '❌ Could not translate. Check the language code.'
            }, { quoted: message });
        }

        // Extract translated text
        let translated = '';
        for (const chunk of data[0]) {
            if (chunk[0]) translated += chunk[0];
        }

        const detectedLang = data[2] || 'unknown';

        await sock.sendMessage(chatId, {
            text: `🌐 *Translation*\n\n*From:* ${detectedLang.toUpperCase()}\n*To:* ${targetLang.toUpperCase()}\n\n*Original:*\n${text}\n\n*Translated:*\n${translated}`
        }, { quoted: message });

    } catch (e) {
        throw e;
    }
}

module.exports = { translateCommand };
