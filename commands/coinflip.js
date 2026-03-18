/** ScottyMd — .coinflip | .dice | .rps commands © ScottyMd by Scotty */
async function coinflipCommand(sock, chatId, message) {
    const result = Math.random() < 0.5 ? '🪙 *HEADS*' : '🪙 *TAILS*';
    await sock.sendMessage(chatId, { text: `🪙 Flipping coin...\n\nResult: ${result}\n_© ScottyMd_` }, { quoted: message });
}
async function diceCommand(sock, chatId, message, args) {
    const sides = parseInt(args[0]) || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await sock.sendMessage(chatId, { text: `🎲 Rolling a ${sides}-sided dice...\n\nResult: *${result}*\n_© ScottyMd_` }, { quoted: message });
}
async function rpsCommand(sock, chatId, message, args) {
    const choices = ['🪨 Rock', '📄 Paper', '✂️ Scissors'];
    const bot = choices[Math.floor(Math.random() * 3)];
    const user = args.join(' ').toLowerCase();
    const map = { rock: '🪨 Rock', paper: '📄 Paper', scissors: '✂️ Scissors' };
    if (!map[user]) return await sock.sendMessage(chatId, { text: '❌ Usage: .rps rock/paper/scissors' }, { quoted: message });
    const u = map[user]; const b = bot;
    let result = '🤝 Draw!';
    if ((u.includes('Rock') && b.includes('Scissors')) || (u.includes('Paper') && b.includes('Rock')) || (u.includes('Scissors') && b.includes('Paper'))) result = '🎉 You win!';
    else if (u !== b) result = '🤖 Bot wins!';
    await sock.sendMessage(chatId, { text: `✊ *Rock Paper Scissors*\n\nYou: ${u}\nBot: ${b}\n\n${result}\n_© ScottyMd_` }, { quoted: message });
}
module.exports = { coinflipCommand, diceCommand, rpsCommand };
