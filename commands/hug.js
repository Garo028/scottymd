/**
 * ScottyMd — .hug .kiss .slap .pat commands
 * Anime action GIFs
 * © @Scottymd
 */
const axios = require('axios');

const ANIME_ACTIONS = {
    hug:   'https://api.otakugifs.xyz/gif?reaction=hug',
    kiss:  'https://api.otakugifs.xyz/gif?reaction=kiss',
    slap:  'https://api.otakugifs.xyz/gif?reaction=slap',
    pat:   'https://api.otakugifs.xyz/gif?reaction=pat',
    poke:  'https://api.otakugifs.xyz/gif?reaction=poke',
    cry:   'https://api.otakugifs.xyz/gif?reaction=cry',
    wave:  'https://api.otakugifs.xyz/gif?reaction=wave',
    wink:  'https://api.otakugifs.xyz/gif?reaction=wink',
    dance: 'https://api.otakugifs.xyz/gif?reaction=dance',
    blush: 'https://api.otakugifs.xyz/gif?reaction=blush',
};

async function animeActionCommand(sock, chatId, message, action) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const apiUrl    = ANIME_ACTIONS[action];
        if (!apiUrl) return;

        const res     = await axios.get(apiUrl, { timeout: 10000 });
        const gifUrl  = res.data?.url;
        if (!gifUrl) return await sock.sendMessage(chatId, { text: `❌ Could not fetch ${action} GIF.` }, { quoted: message });

        const gifData = await axios.get(gifUrl, { responseType: 'arraybuffer', timeout: 15000 });
        const target  = mentioned.length ? `@${mentioned[0].split('@')[0]}` : '';
        const sender  = message.key.fromMe ? 'You' : `@${(getSender(sock, message)).split('@')[0]}`;

        const captions = {
            hug:   `🤗 ${sender} hugs ${target || 'everyone'}!`,
            kiss:  `💋 ${sender} kisses ${target || 'everyone'}!`,
            slap:  `👋 ${sender} slaps ${target || 'the air'}!`,
            pat:   `🤚 ${sender} pats ${target || 'everyone'}!`,
            poke:  `👉 ${sender} pokes ${target || 'someone'}!`,
            cry:   `😢 ${sender} is crying...`,
            wave:  `👋 ${sender} waves!`,
            wink:  `😉 ${sender} winks ${target ? `at ${target}` : ''}!`,
            dance: `💃 ${sender} is dancing!`,
            blush: `😳 ${sender} is blushing!`,
        };

        await sock.sendMessage(chatId, {
            video: Buffer.from(gifData.data),
            caption: `${captions[action]}\n\n_© @Scottymd_`,
            gifPlayback: true,
            mentions: mentioned
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ ${action} failed.` }, { quoted: message });
    }
}

module.exports = { animeActionCommand };
