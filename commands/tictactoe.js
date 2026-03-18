/**
 * ScottyMd — .tictactoe command
 * Play tic-tac-toe vs another member
 * © @Scottymd
 */
const games = new Map();

function renderBoard(board) {
    const symbols = { 0: '⬜', 1: '❌', 2: '⭕' };
    let b = '';
    for (let i = 0; i < 9; i += 3) {
        b += `${symbols[board[i]]}${symbols[board[i+1]]}${symbols[board[i+2]]}\n`;
    }
    return b;
}

function checkWinner(board) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(c => c !== 0)) return 'draw';
    return null;
}

async function tictactoeCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        // Start game
        if (!games.has(chatId) || args[0] === 'new') {
            if (!mentioned.length) {
                return await sock.sendMessage(chatId, {
                    text: `🎮 *Tic Tac Toe*\n\nChallenge someone:\n*.tictactoe @user*\n\nPositions:\n1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣`
                }, { quoted: message });
            }

            const opponent = mentioned[0];
            if (opponent === senderId) return await sock.sendMessage(chatId, { text: "❌ You can't play against yourself!" }, { quoted: message });

            const game = {
                board: Array(9).fill(0),
                players: { 1: senderId, 2: opponent },
                turn: 1
            };
            games.set(chatId, game);

            return await sock.sendMessage(chatId, {
                text: `🎮 *Tic Tac Toe Started!*\n\n❌ @${senderId.split('@')[0]}\nvs\n⭕ @${opponent.split('@')[0]}\n\n${renderBoard(game.board)}\n❌ @${senderId.split('@')[0]}'s turn! Pick 1-9`,
                mentions: [senderId, opponent]
            });
        }

        // Make a move
        const pos = parseInt(args[0]);
        if (isNaN(pos) || pos < 1 || pos > 9) {
            return await sock.sendMessage(chatId, { text: '❌ Pick a position from 1-9' }, { quoted: message });
        }

        const game = games.get(chatId);
        if (!game) return;

        const playerNum = game.players[1] === senderId ? 1 : game.players[2] === senderId ? 2 : null;
        if (!playerNum) return await sock.sendMessage(chatId, { text: '❌ You are not in this game.' }, { quoted: message });
        if (game.turn !== playerNum) return await sock.sendMessage(chatId, { text: `❌ Not your turn!` }, { quoted: message });
        if (game.board[pos - 1] !== 0) return await sock.sendMessage(chatId, { text: '❌ That position is taken!' }, { quoted: message });

        game.board[pos - 1] = playerNum;
        const winner = checkWinner(game.board);

        if (winner === 'draw') {
            games.delete(chatId);
            return await sock.sendMessage(chatId, { text: `${renderBoard(game.board)}\n🤝 *It's a draw!*\n\n_© @Scottymd_` });
        }

        if (winner) {
            const winnerId = game.players[winner];
            games.delete(chatId);
            return await sock.sendMessage(chatId, {
                text: `${renderBoard(game.board)}\n🏆 *@${winnerId.split('@')[0]} wins!*\n\n_© @Scottymd_`,
                mentions: [winnerId]
            });
        }

        game.turn = playerNum === 1 ? 2 : 1;
        const nextPlayer = game.players[game.turn];
        const symbol = game.turn === 1 ? '❌' : '⭕';

        await sock.sendMessage(chatId, {
            text: `${renderBoard(game.board)}\n${symbol} @${nextPlayer.split('@')[0]}'s turn! Pick 1-9`,
            mentions: [nextPlayer]
        });

    } catch (e) {
        console.error('TicTacToe error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Game error: ' + e.message }, { quoted: message });
    }
}

module.exports = tictactoeCommand;
