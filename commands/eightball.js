/**
 * ScottyMd — .8ball command
 * Magic 8 ball that answers yes/no questions
 */

const RESPONSES = [
    // Positive
    { text: "It is certain! 🎯",         type: "positive" },
    { text: "Without a doubt! ✅",        type: "positive" },
    { text: "Yes, definitely! 💯",        type: "positive" },
    { text: "You may rely on it! 🤝",     type: "positive" },
    { text: "As I see it, yes! 👁️",      type: "positive" },
    { text: "Most likely! 📈",            type: "positive" },
    { text: "Outlook is very good! 🌟",   type: "positive" },
    { text: "Signs point to yes! ☝️",     type: "positive" },
    // Neutral
    { text: "Reply hazy, try again 🌫️",  type: "neutral" },
    { text: "Ask again later ⏳",         type: "neutral" },
    { text: "Better not tell you now 🤫", type: "neutral" },
    { text: "Cannot predict now 🔮",      type: "neutral" },
    { text: "Concentrate and ask again 🧘", type: "neutral" },
    // Negative
    { text: "Don't count on it! 🚫",      type: "negative" },
    { text: "My reply is no! ❌",          type: "negative" },
    { text: "My sources say no! 📉",      type: "negative" },
    { text: "Outlook not so good 😬",     type: "negative" },
    { text: "Very doubtful! 🤔",          type: "negative" },
];

async function eightBallCommand(sock, chatId, message, args) {
    try {
        const question = args.join(' ').trim();

        if (!question) {
            return await sock.sendMessage(chatId, {
                text: '❌ Ask a question!\n\n*Usage:* .8ball Will I become rich?'
            }, { quoted: message });
        }

        const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
        const emoji = response.type === 'positive' ? '🟢' : response.type === 'negative' ? '🔴' : '🟡';

        await sock.sendMessage(chatId, {
            text: `🎱 *Magic 8 Ball*\n\n❓ *Q:* ${question}\n\n${emoji} *A:* ${response.text}\n\n_© @Scottymd_`
        }, { quoted: message });

    } catch (e) {
        console.error('8ball error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ The magic 8 ball is broken!' }, { quoted: message });
    }
}

module.exports = eightBallCommand;
