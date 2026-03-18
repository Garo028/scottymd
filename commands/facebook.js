/**
 * ScottyMd — .fb command
 * Download Facebook videos
 * © @Scottymd
 */
const axios = require('axios');

async function facebookCommand(sock, chatId, message, args) {
    try {
        const url = args[0];
        if (!url || !url.includes('facebook') && !url.includes('fb.')) {
            return await sock.sendMessage(chatId, { text: '❌ Send a Facebook video URL.\nUsage: .fb <url>' }, { quoted: message });
        }
        await sock.sendMessage(chatId, { text: '⬇️ Downloading Facebook video...' }, { quoted: message });
        const api = `https://api.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api, { timeout: 20000 });
        if (!res.data?.hd && !res.data?.sd) return await sock.sendMessage(chatId, { text: '❌ Could not download. Make sure the video is public.' }, { quoted: message });
        const videoUrl = res.data.hd || res.data.sd;
        const vid = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 30000 });
        await sock.sendMessage(chatId, { video: Buffer.from(vid.data), caption: '📱 Facebook Video\n\n_© @Scottymd_' }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Facebook download failed.' }, { quoted: message });
    }
}
module.exports = facebookCommand;
