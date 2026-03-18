/** ScottyMd — .trivia command © ScottyMd by Scotty */
const axios = require('axios');
const games = new Map();
async function triviaCommand(sock, chatId, message) {
    try {
        const res  = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple', { timeout: 10000 });
        const q    = res.data.results[0];
        const all  = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random()-0.5);
        const idx  = all.indexOf(q.correct_answer);
        const opts = all.map((o,i)=>`${['A','B','C','D'][i]}. ${o.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,'&')}`);
        games.set(chatId, { ans: ['A','B','C','D'][idx], expires: Date.now()+30000 });
        const clean = (s) => s.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
        await sock.sendMessage(chatId, { text: `🎯 *Trivia!* (${q.category})\n\n❓ ${clean(q.question)}\n\n${opts.map(o=>clean(o)).join('\n')}\n\n⏰ 30 seconds! Reply A, B, C or D\n_© ScottyMd_` }, { quoted: message });
    } catch { await sock.sendMessage(chatId, { text: '❌ Could not load trivia. Try again.' }, { quoted: message }); }
}
async function checkTriviaAnswer(sock, chatId, message, text) {
    const game = games.get(chatId);
    if (!game || Date.now() > game.expires) { games.delete(chatId); return; }
    if (text.toUpperCase().trim() === game.ans) {
        games.delete(chatId);
        const { getSender } = require('../lib/getSender');
        const s = getSender(sock, message);
        await sock.sendMessage(chatId, { text: `🎉 @${s.split('@')[0]} got it right! The answer was *${game.ans}* ✅\n_© ScottyMd_`, mentions: [s] });
    }
}
module.exports = { triviaCommand, checkTriviaAnswer };
