/**
 * ScottyMd — .fact command
 * Sends a random interesting fact
 */
const axios = require('axios');

const FALLBACK_FACTS = [
    "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
    "A group of flamingos is called a flamboyance.",
    "Octopuses have three hearts, two pump blood to the gills, and one pumps it to the rest of the body.",
    "The shortest war in history was between Britain and Zanzibar in 1896. Zanzibar surrendered after just 38 minutes.",
    "A day on Venus is longer than a year on Venus.",
    "Bananas are berries, but strawberries are not.",
    "The human brain uses about 20% of the body's total energy despite being only 2% of body weight.",
    "Sharks are older than trees. They have existed for over 400 million years.",
    "There are more stars in the universe than grains of sand on all of Earth's beaches.",
    "A bolt of lightning is five times hotter than the surface of the sun.",
];

async function factCommand(sock, chatId, message) {
    try {
        let fact;

        try {
            const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
            fact = res.data.text;
        } catch {
            fact = FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
        }

        await sock.sendMessage(chatId, {
            text: `🧠 *Random Fact*\n\n${fact}\n\n_© @Scottymd_`
        }, { quoted: message });

    } catch (e) {
        console.error('Fact error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch fact.' }, { quoted: message });
    }
}

module.exports = factCommand;
