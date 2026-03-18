/** ScottyMd — .nowplaying fake now playing card © ScottyMd by Scotty */
async function nowPlayingCommand(sock, chatId, message, args) {
    const song   = args.join(' ').trim() || 'Unknown Song';
    const bar    = '▓'.repeat(7) + '░'.repeat(13);
    const time   = `1:${String(Math.floor(Math.random()*59)).padStart(2,'0')}`;
    const total  = `3:${String(Math.floor(Math.random()*59)+10).padStart(2,'0')}`;
    await sock.sendMessage(chatId, { text: `🎵 *Now Playing*\n\n╔══════════════════╗\n║ 🎵 ${song.slice(0,20)}\n║ ⏱️ ${time} ${bar} ${total}\n║ ⏮️ ⏸️ ⏭️ 🔀 🔁\n╚══════════════════╝\n_© ScottyMd_` }, { quoted: message });
}
module.exports = nowPlayingCommand;
