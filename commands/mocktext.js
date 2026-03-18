/** ScottyMd — .mock spongebob mock text © ScottyMd by Scotty */
async function mockCommand(sock, chatId, message, args) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const text = args.join(' ') || quoted?.conversation || quoted?.extendedTextMessage?.text || '';
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .mock <text> or reply to a message' }, { quoted: message });
    let result = ''; let upper = false;
    for (const c of text) { result += upper ? c.toUpperCase() : c.toLowerCase(); if (c !== ' ') upper = !upper; }
    await sock.sendMessage(chatId, { text: result + '\n\n_© ScottyMd_' }, { quoted: message });
}
module.exports = mockCommand;
