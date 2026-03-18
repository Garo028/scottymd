/**
 * ScottyMd — .truth / .dare commands
 * Truth or dare game
 * © @Scottymd
 */
const TRUTHS = [
    "What is the most embarrassing thing you've ever done?",
    "Have you ever lied to get out of trouble? What was the lie?",
    "What is your biggest fear?",
    "Have you ever had a crush on someone in this group?",
    "What is the most childish thing you still do?",
    "What is something you've never told anyone?",
    "Have you ever cheated on a test?",
    "What is the worst gift you've ever received?",
    "Have you ever pretended to be sick to skip school or work?",
    "What is the most embarrassing song you secretly love?",
];

const DARES = [
    "Send a voice note singing your favourite song right now.",
    "Change your profile picture to a silly face for 1 hour.",
    "Send a message to the last person you texted saying 'I love you'.",
    "Do 20 push-ups and post a video as proof.",
    "Text someone you haven't talked to in months.",
    "Send the most cringe-worthy selfie you have.",
    "Post a status with only emojis for the next 10 minutes.",
    "Call someone in this group and sing happy birthday.",
    "Send a screenshot of your last conversation.",
    "Write a poem about the person above you in this group.",
];

async function truthCommand(sock, chatId, message) {
    const truth = TRUTHS[Math.floor(Math.random() * TRUTHS.length)];
    await sock.sendMessage(chatId, {
        text: `🤍 *Truth*\n\n_${truth}_\n\n_© @Scottymd_`
    }, { quoted: message });
}

async function dareCommand(sock, chatId, message) {
    const dare = DARES[Math.floor(Math.random() * DARES.length)];
    await sock.sendMessage(chatId, {
        text: `🔥 *Dare*\n\n_${dare}_\n\n_© @Scottymd_`
    }, { quoted: message });
}

module.exports = { truthCommand, dareCommand };
