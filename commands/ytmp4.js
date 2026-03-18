/**
 * ScottyMd — .video command
 * Download YouTube video
 * © @Scottymd
 */
const yts   = require('yt-search');
const ytdl  = require('ytdl-core');
const fs    = require('fs');
const path  = require('path');

async function videoCommand(sock, chatId, message, args) {
    try {
        const query = args.join(' ').trim();
        if (!query) return await sock.sendMessage(chatId, { text: '❌ Usage: .video <title or URL>' }, { quoted: message });
        await sock.sendMessage(chatId, { text: `🔍 Searching: *${query}*...` }, { quoted: message });

        let videoUrl = query;
        let title    = query;

        if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
            const search = await yts(query);
            if (!search.videos.length) return await sock.sendMessage(chatId, { text: '❌ No results found.' }, { quoted: message });
            videoUrl = search.videos[0].url;
            title    = search.videos[0].title;
            if (search.videos[0].duration.seconds > 300) return await sock.sendMessage(chatId, { text: '❌ Video too long (max 5 mins for video).' }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: `⬇️ Downloading: *${title}*...` }, { quoted: message });
        const tmpFile = path.join('./temp', `yt_vid_${Date.now()}.mp4`);

        await new Promise((resolve, reject) => {
            ytdl(videoUrl, { quality: 'lowestvideo' })
                .pipe(fs.createWriteStream(tmpFile))
                .on('finish', resolve)
                .on('error', reject);
        });

        await sock.sendMessage(chatId, {
            video: fs.readFileSync(tmpFile),
            caption: `🎬 *${title}*\n\n_© @Scottymd_`
        }, { quoted: message });

        fs.unlinkSync(tmpFile);
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Video download failed: ' + e.message }, { quoted: message });
    }
}
module.exports = videoCommand;
