/**
 * ScottyMd — .calc command
 * Safe calculator
 * © @Scottymd
 */
async function calcCommand(sock, chatId, message, args) {
    try {
        const expr = args.join(' ').trim();
        if (!expr) return await sock.sendMessage(chatId, { text: '❌ Usage: .calc 2 + 2\n.calc (10 * 5) / 2' }, { quoted: message });
        // Safe eval — only allow math characters
        if (!/^[\d\s\+\-\*\/\(\)\.\%\^]+$/.test(expr)) {
            return await sock.sendMessage(chatId, { text: '❌ Only math expressions allowed.' }, { quoted: message });
        }
        const result = Function('"use strict"; return (' + expr + ')')();
        await sock.sendMessage(chatId, {
            text: `🧮 *Calculator*\n\n📥 Input: \`${expr}\`\n📤 Result: *${result}*\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Invalid expression. Example: .calc 10 * 5 + 3' }, { quoted: message });
    }
}
module.exports = calcCommand;
