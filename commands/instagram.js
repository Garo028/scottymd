/**
 * ScottyMd — .ig command
 * Download Instagram reels/posts
 * © @Scottymd
 */
const axios = require('axios');

async function instagramCommand(sock, chatId, message, args) {
    try {
        const url = args[0];
        if (!url || !url.includes('instagram')) return await sock.sendMessage(chatId, { text: '❌ Send an Instagram URL.\nUsage: .ig <url>' }, { quoted: message });
        await sock.sendMessage(chatId, { text: '⬇️ Downloading Instagram media...' }, { quoted: message });
        const api = `https://api.ryzendesu.vip/api/downloader/igdl?url=${encodeURIComponent(url)}`;
        const res = await axios.get(api, { timeout: 20000 });
        const data = res.data;
        if (!data?.data?.[0]?.url) return await sock.sendMessage(chatId, { text: '❌ Could not download. Make sure the post is public.' }, { quoted: message });
        const mediaUrl = data.data[0].url;
        const media = await axios.get(mediaUrl, { responseType: 'arraybuffer', timeout: 30000 });
        const isVideo = mediaUrl.includes('.mp4') || data.data[0].type === 'video';
        if (isVideo) {
            await sock.sendMessage(chatId, { video: Buffer.from(media.data), caption: '📸 Instagram Video\n\n_© @Scottymd_' }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { image: Buffer.from(media.data), caption: '📸 Instagram Image\n\n_© @Scottymd_' }, { quoted: message });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Instagram download failed. Make sure the post is public.' }, { quoted: message });
    }
}
module.exports = instagramCommand;
