/**
 * ScottyMd - .tts command
 * Converts text to speech audio message
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function ttsCommand(sock, chatId, message, args) {
    try {
        const text = args.join(' ').trim();

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide text.\n\n*Usage:* .tts Hello how are you'
            }, { quoted: message });
        }

        if (text.length > 200) {
            return await sock.sendMessage(chatId, {
                text: '❌ Text is too long. Maximum 200 characters.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: '🎙️ Generating audio...' }, { quoted: message });

        // Using Google TTS (free, no key needed)
        const lang = 'en';
        const encodedText = encodeURIComponent(text);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob`;

        const response = await axios.get(ttsUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        const audioBuffer = Buffer.from(response.data);
        const tmpFile = path.join('./temp', `tts_${Date.now()}.mp3`);
        fs.writeFileSync(tmpFile, audioBuffer);

        await sock.sendMessage(chatId, {
            audio: fs.readFileSync(tmpFile),
            mimetype: 'audio/mpeg',
            ptt: true // sends as voice note
        }, { quoted: message });

        fs.unlinkSync(tmpFile);

    } catch (e) {
        console.error('TTS error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ TTS failed. Please try again.'
        }, { quoted: message });
    }
}

module.exports = ttsCommand;
