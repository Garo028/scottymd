/**
 * ScottyMd — .motivation command
 * Daily motivational message
 * © @Scottymd
 */
const MESSAGES = [
    "Every day is a new chance to change your life. 🌅",
    "The harder you work for something, the greater you'll feel when you achieve it. 💪",
    "Dream big. Work hard. Stay focused. 🎯",
    "Don't watch the clock; do what it does. Keep going. ⏰",
    "Push yourself because no one else is going to do it for you. 🔥",
    "Great things never come from comfort zones. 🚀",
    "Success doesn't just find you. You have to go out and get it. 🏆",
    "The key to success is to focus on goals, not obstacles. 🗝️",
    "Don't stop when you're tired. Stop when you're done. 💯",
    "Believe you can and you're halfway there. ✨",
    "It always seems impossible until it's done. 🌟",
    "You are stronger than you think. Keep going! 💎",
];

async function motivationCommand(sock, chatId, message) {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    await sock.sendMessage(chatId, {
        text: `💪 *Daily Motivation*\n\n_${msg}_\n\n_© @Scottymd_`
    }, { quoted: message });
}
module.exports = motivationCommand;
