/** ScottyMd — .wc word count command © ScottyMd by Scotty */
async function wordcountCommand(sock, chatId, message, args) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const text = args.join(' ') || quoted?.conversation || quoted?.extendedTextMessage?.text || '';
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Reply to a message or provide text.\nUsage: .wc <text>' }, { quoted: message });
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length; const lines = text.split('\n').length;
    await sock.sendMessage(chatId, { text: `📊 *Word Count*\n\n📝 Words: ${words}\n🔤 Characters: ${chars}\n📄 Lines: ${lines}\n\n_© ScottyMd_` }, { quoted: message });
}
module.exports = wordcountCommand;
