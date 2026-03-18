/**
 * ScottyMd - .lyrics command
 * Fetches song lyrics using free lyrics.ovh API
 */
const axios = require('axios');

async function lyricsCommand(sock, chatId, message, args) {
    try {
        const query = args.join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a song name.\n\n*Usage:*\n.lyrics <song name>\n.lyrics <artist> - <song>\n\n*Examples:*\n.lyrics Bohemian Rhapsody\n.lyrics Ed Sheeran - Shape of You'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `🎵 Searching lyrics for: *${query}*...`
        }, { quoted: message });

        let artist = '';
        let title = '';

        // Check if format is "artist - song"
        if (query.includes(' - ')) {
            [artist, title] = query.split(' - ').map(s => s.trim());
        } else {
            // Try to guess — treat first word as artist, rest as song
            title = query;
            artist = query.split(' ')[0];
        }

        // Try lyrics.ovh API (free, no key)
        let lyrics = null;
        let songArtist = artist;
        let songTitle = title;

        try {
            const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
            const response = await axios.get(url, { timeout: 10000 });
            if (response.data?.lyrics) {
                lyrics = response.data.lyrics;
            }
        } catch { }

        // If first try failed and no dash was used, try full query as title with unknown artist
        if (!lyrics && !query.includes(' - ')) {
            try {
                const url = `https://api.lyrics.ovh/v1/unknown/${encodeURIComponent(query)}`;
                const response = await axios.get(url, { timeout: 10000 });
                if (response.data?.lyrics) {
                    lyrics = response.data.lyrics;
                    songArtist = 'Unknown';
                    songTitle = query;
                }
            } catch { }
        }

        if (!lyrics) {
            return await sock.sendMessage(chatId, {
                text: `❌ Lyrics not found for "*${query}*"\n\nTry using: .lyrics <artist> - <song title>\nExample: .lyrics Queen - Bohemian Rhapsody`
            }, { quoted: message });
        }

        // Trim if too long for WhatsApp
        const maxLength = 3500;
        let finalLyrics = lyrics.trim();
        let truncated = false;

        if (finalLyrics.length > maxLength) {
            finalLyrics = finalLyrics.substring(0, maxLength);
            truncated = true;
        }

        const header = `🎵 *${songTitle}*\n👤 *${songArtist}*\n${'─'.repeat(25)}\n\n`;
        const footer = truncated ? '\n\n_...lyrics truncated (too long)_' : '';

        await sock.sendMessage(chatId, {
            text: header + finalLyrics + footer
        }, { quoted: message });

    } catch (e) {
        console.error('Lyrics error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ Could not fetch lyrics. Please try again with artist name included.\nExample: .lyrics Queen - Bohemian Rhapsody'
        }, { quoted: message });
    }
}

module.exports = lyricsCommand;
