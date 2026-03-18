/** ScottyMd — .password generator command © ScottyMd by Scotty */
async function passwordCommand(sock, chatId, message, args) {
    const len  = Math.min(parseInt(args[0]) || 16, 64);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    await sock.sendMessage(chatId, { text: `🔐 *Generated Password*\n\n\`${pwd}\`\n\n📏 Length: ${len} chars\n\n_⚠️ Never share passwords publicly!_\n_© ScottyMd_` }, { quoted: message });
}
module.exports = passwordCommand;
