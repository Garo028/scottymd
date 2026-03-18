/**
 * ScottyMd — .wyr command
 * Would You Rather game
 * © @Scottymd
 */
const axios = require('axios');
const FALLBACK = [
    "Would you rather be able to fly OR be invisible?",
    "Would you rather have unlimited money OR unlimited time?",
    "Would you rather be famous OR be powerful?",
    "Would you rather live without music OR live without TV?",
    "Would you rather always be 10 minutes late OR always be 20 minutes early?",
    "Would you rather lose all your money OR all your photos and memories?",
    "Would you rather be able to talk to animals OR speak all human languages?",
    "Would you rather live in the past OR the future?",
];

async function wyrCommand(sock, chatId, message) {
    try {
        let q;
        try {
            const res = await axios.get('https://would-you-rather-api.abaanshanid.repl.co/', { timeout: 8000 });
            q = res.data?.data;
        } catch {
            q = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
        }
        await sock.sendMessage(chatId, {
            text: `🤔 *Would You Rather?*\n\n_${q}_\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Command failed.' }, { quoted: message });
    }
}
module.exports = wyrCommand;
