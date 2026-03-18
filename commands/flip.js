/**
 * ScottyMd — .flip command
 * Flip a coin or make a random choice
 * © @Scottymd
 */
async function flipCommand(sock, chatId, message, args) {
    try {
        if (args.length >= 2) {
            // Random choice from options
            const choices = args;
            const chosen  = choices[Math.floor(Math.random() * choices.length)];
            return await sock.sendMessage(chatId, {
                text: `🎲 *Random Choice*\n\nOptions: ${choices.join(', ')}\n\n✅ *Result: ${chosen}*\n\n_© @Scottymd_`
            }, { quoted: message });
        }
        // Coin flip
        const result = Math.random() < 0.5 ? '🪙 HEADS' : '🪙 TAILS';
        await sock.sendMessage(chatId, {
            text: `🪙 *Coin Flip*\n\n*${result}!*\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Flip failed.' }, { quoted: message });
    }
}
module.exports = flipCommand;
