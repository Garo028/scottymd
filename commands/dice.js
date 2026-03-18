/**
 * ScottyMd — .dice command
 * Roll dice
 * © @Scottymd
 */
async function diceCommand(sock, chatId, message, args) {
    try {
        const sides = parseInt(args[0]) || 6;
        const count = Math.min(parseInt(args[1]) || 1, 10);
        if (sides < 2 || sides > 100) return await sock.sendMessage(chatId, { text: '❌ Dice must have 2-100 sides.' }, { quoted: message });
        const rolls  = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        const total  = rolls.reduce((a, b) => a + b, 0);
        const emojis = ['⚀','⚁','⚂','⚃','⚄','⚅'];
        const display = rolls.map(r => sides === 6 ? emojis[r-1] : `[${r}]`).join(' ');
        await sock.sendMessage(chatId, {
            text: `🎲 *Dice Roll (${count}d${sides})*\n\n${display}\n\n${count > 1 ? `Total: *${total}*\n` : ''}Result: *${count === 1 ? rolls[0] : rolls.join(', ')}*\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Dice roll failed.' }, { quoted: message });
    }
}
module.exports = diceCommand;
