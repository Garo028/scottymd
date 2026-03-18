/** ScottyMd — .hangman command © ScottyMd by Scotty */
const WORDS = ['elephant','programming','javascript','whatsapp','computer','keyboard','language','football','Zimbabwe','beautiful','knowledge','adventure'];
const games = new Map();
async function hangmanCommand(sock, chatId, message) {
    const word = WORDS[Math.floor(Math.random()*WORDS.length)].toLowerCase();
    games.set(chatId, { word, guessed: [], wrong: [], tries: 6 });
    const display = word.split('').map(c=>'_ ').join('');
    await sock.sendMessage(chatId, { text: `🎮 *Hangman Started!*\n\n${display}\n\nGuesses left: 6 ❤️\n\nSend .guess <letter> to guess!\n_© ScottyMd_` }, { quoted: message });
}
async function hangmanGuess(sock, chatId, message, args) {
    const game = games.get(chatId);
    if (!game) return await sock.sendMessage(chatId, { text: '❌ No game active. Use .hangman to start.' }, { quoted: message });
    const letter = args[0]?.toLowerCase();
    if (!letter || letter.length !== 1) return await sock.sendMessage(chatId, { text: '❌ Usage: .guess <single letter>' }, { quoted: message });
    if (game.guessed.includes(letter) || game.wrong.includes(letter)) return await sock.sendMessage(chatId, { text: `❌ Already guessed *${letter}*!` }, { quoted: message });
    const display = (arr) => game.word.split('').map(c => arr.includes(c) ? c : '_').join(' ');
    if (game.word.includes(letter)) {
        game.guessed.push(letter);
        const d = display(game.guessed);
        if (!d.includes('_')) { games.delete(chatId); return await sock.sendMessage(chatId, { text: `🎉 You won! The word was *${game.word}*!\n_© ScottyMd_` }); }
        await sock.sendMessage(chatId, { text: `✅ *${letter}* is in the word!\n\n${d}\n\nWrong: ${game.wrong.join(', ')||'none'}\nLives: ${'❤️'.repeat(game.tries)}\n_© ScottyMd_` });
    } else {
        game.wrong.push(letter); game.tries--;
        if (game.tries <= 0) { games.delete(chatId); return await sock.sendMessage(chatId, { text: `💀 Game over! The word was *${game.word}*\n_© ScottyMd_` }); }
        await sock.sendMessage(chatId, { text: `❌ *${letter}* is NOT in the word!\n\n${display(game.guessed)}\n\nWrong: ${game.wrong.join(', ')}\nLives: ${'❤️'.repeat(game.tries)}\n_© ScottyMd_` });
    }
}
module.exports = { hangmanCommand, hangmanGuess };
