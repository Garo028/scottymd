/**
 * ScottyMd — .tiktok command
 * Download TikTok videos without watermark
 * © @Scottymd
 */
const axios = require('axios');

async function tiktokCommand(sock, chatId, message, args) {
    try {
        const url = args[0];
        if (!url || !url.includes('tiktok')) return await sock.sendMessage(chatId, { text: '❌ Send a TikTok URL.\nUsage: .tiktok <url>' }, { quoted: message });
        await sock.sendMessage(chatId, { text: '⬇️ Downloading TikTok video...' }, { quoted: message });
        const api = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api, { timeout: 20000 });
        const data = res.data;
        if (!data?.video?.noWatermark) return await sock.sendMessage(chatId, { text: '❌ Could not fetch video. Make sure the link is valid and public.' }, { quoted: message });
        const vid = await axios.get(data.video.noWatermark, { responseType: 'arraybuffer', timeout: 30000 });
        await sock.sendMessage(chatId, { video: Buffer.from(vid.data), caption: `🎵 *${data.title || 'TikTok Video'}*\n\n_© @Scottymd_` }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ TikTok download failed. Try another link.' }, { quoted: message });
    }
}
module.exports = tiktokCommand;
