/**
 * ScottyMd — .insult command
 * Funny insult generator (all in good fun!)
 * © @Scottymd
 */
const INSULTS = [
    "You're the human equivalent of a participation trophy. 🏆",
    "I'd explain it to you but I don't have crayons with me. 🖍️",
    "You're the reason the gene pool needs a lifeguard. 🏊",
    "You have the personality of a wet sock. 🧦",
    "If laughter is the best medicine, your face could cure diseases. 😂",
    "You're so slow, you'd be late to your own funeral. ⚰️",
    "Even your Wi-Fi signal has more personality than you. 📶",
    "You're like a cloud — when you disappear, it's a beautiful day. ☀️",
    "Your secrets are safe with me. I never listen when you talk anyway. 👂",
    "You bring joy whenever you leave the room. 🚪",
];

async function insultCommand(sock, chatId, message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const insult = INSULTS[Math.floor(Math.random() * INSULTS.length)];

    if (!mentioned.length) {
        return await sock.sendMessage(chatId, {
            text: `😂 *Funny Insult*\n\n${insult}\n\n_All in good fun! 😄_\n_© @Scottymd_`
        }, { quoted: message });
    }

    const user = mentioned[0];
    await sock.sendMessage(chatId, {
        text: `😂 *@${user.split('@')[0]}*\n\n${insult}\n\n_All in good fun! 😄_\n_© @Scottymd_`,
        mentions: [user]
    }, { quoted: message });
}
module.exports = insultCommand;
