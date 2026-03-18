/**
 * ScottyMd — .b64 command
 * Encode/decode Base64
 * © @Scottymd
 */
async function base64Command(sock, chatId, message, args) {
    try {
        const mode  = args[0]?.toLowerCase();
        const input = args.slice(1).join(' ');
        if (!mode || !input) return await sock.sendMessage(chatId, { text: '❌ Usage:\n.b64 encode Hello World\n.b64 decode SGVsbG8gV29ybGQ=' }, { quoted: message });
        if (mode === 'encode') {
            const encoded = Buffer.from(input).toString('base64');
            return await sock.sendMessage(chatId, { text: `🔒 *Base64 Encoded:*\n\n\`${encoded}\`\n\n_© @Scottymd_` }, { quoted: message });
        }
        if (mode === 'decode') {
            const decoded = Buffer.from(input, 'base64').toString('utf8');
            return await sock.sendMessage(chatId, { text: `🔓 *Base64 Decoded:*\n\n${decoded}\n\n_© @Scottymd_` }, { quoted: message });
        }
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Base64 conversion failed.' }, { quoted: message });
    }
}
module.exports = base64Command;
