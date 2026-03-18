/** ScottyMd — .math quiz command © ScottyMd by Scotty */
const games = new Map();
async function mathCommand(sock, chatId, message) {
    const a = Math.floor(Math.random()*20)+1, b = Math.floor(Math.random()*20)+1;
    const ops = ['+','-','*']; const op = ops[Math.floor(Math.random()*ops.length)];
    const ans = op==='+' ? a+b : op==='-' ? a-b : a*b;
    games.set(chatId, { ans, expires: Date.now()+30000 });
    await sock.sendMessage(chatId, { text: `🧮 *Math Challenge!*\n\n${a} ${op} ${b} = ?\n\nReply with the answer! ⏰ 30 seconds\n_© ScottyMd_` }, { quoted: message });
}
async function checkMathAnswer(sock, chatId, message, text) {
    const game = games.get(chatId);
    if (!game || Date.now() > game.expires) { games.delete(chatId); return; }
    if (parseInt(text) === game.ans) {
        games.delete(chatId);
        const { getSender } = require('../lib/getSender');
        const s = getSender(sock, message);
        await sock.sendMessage(chatId, { text: `🎉 @${s.split('@')[0]} got it! Answer: *${game.ans}*\n_© ScottyMd_`, mentions: [s] });
    }
}
module.exports = { mathCommand, checkMathAnswer };
