/**
 * ScottyMd — .pickup command
 * Random pickup lines
 * © @Scottymd
 */
const LINES = [
    "Are you a magician? Because whenever I look at you, everyone else disappears. ✨",
    "Do you have a map? I keep getting lost in your eyes. 🗺️",
    "Is your name Google? Because you have everything I've been searching for. 🔍",
    "Are you a parking ticket? Because you've got 'fine' written all over you. 😏",
    "Do you believe in love at first swipe? 📱",
    "If you were a vegetable, you'd be a cute-cumber. 🥒",
    "Are you a Wi-Fi signal? Because I'm feeling a connection. 📶",
    "Do you have a sunburn, or are you always this hot? 🔥",
    "Is your name Alexa? Because I've been looking for you. 🎙️",
    "Are you made of copper and tellurium? Because you're CuTe. ⚗️",
];

async function pickupCommand(sock, chatId, message) {
    const line = LINES[Math.floor(Math.random() * LINES.length)];
    await sock.sendMessage(chatId, {
        text: `💘 *Pickup Line*\n\n_${line}_\n\n_© @Scottymd_`
    }, { quoted: message });
}
module.exports = pickupCommand;
