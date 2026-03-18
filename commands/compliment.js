/**
 * ScottyMd — .compliment command
 * Send a compliment to someone
 * © @Scottymd
 */
const COMPLIMENTS = [
    "You have the most incredible smile — it lights up the whole room! 😊",
    "You're one of the most genuine people I've ever met. 💯",
    "Your kindness is a superpower. Never stop being you! 💪",
    "You make the world a better place just by being in it. 🌍",
    "Your intelligence is truly impressive — you think about things in such a unique way! 🧠",
    "You're stronger than you know and braver than you believe. 🦁",
    "The way you carry yourself is absolutely inspiring! ✨",
    "You have an amazing ability to make everyone around you feel special. 💝",
    "Your energy is contagious — in the best possible way! ⚡",
    "You're not just talented, you're exceptional! 🌟",
];

async function complimentCommand(sock, chatId, message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const comp = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];

    if (!mentioned.length) {
        return await sock.sendMessage(chatId, {
            text: `💌 *Compliment*\n\n${comp}\n\n_© @Scottymd_`
        }, { quoted: message });
    }

    const user = mentioned[0];
    await sock.sendMessage(chatId, {
        text: `💌 *Compliment for @${user.split('@')[0]}*\n\n${comp}\n\n_© @Scottymd_`,
        mentions: [user]
    }, { quoted: message });
}
module.exports = complimentCommand;
