/**
 * ScottyMd - .joke command
 * Sends a random joke (free API, no key needed)
 */
const axios = require('axios');

async function jokeCommand(sock, chatId, message, args) {
    try {
        const category = args[0]?.toLowerCase() || 'any';

        // JokeAPI - free, no key needed
        const validCategories = ['any', 'programming', 'misc', 'dark', 'pun', 'spooky', 'christmas'];
        const cat = validCategories.includes(category) ? category : 'any';

        const url = `https://v2.jokeapi.dev/joke/${cat === 'any' ? 'Any' : cat}?blacklistFlags=racist,sexist&safe-mode`;

        const response = await axios.get(url, { timeout: 8000 });
        const data = response.data;

        if (data.error) {
            return await sock.sendMessage(chatId, {
                text: '❌ Could not fetch a joke. Try again!'
            }, { quoted: message });
        }

        let jokeText = '';

        if (data.type === 'single') {
            jokeText = `😂 *Joke*\n\n${data.joke}`;
        } else if (data.type === 'twopart') {
            jokeText = `😂 *Joke*\n\n*Q:* ${data.setup}\n\n*A:* ${data.delivery}`;
        }

        await sock.sendMessage(chatId, {
            text: jokeText
        }, { quoted: message });

    } catch (e) {
        console.error('Joke error:', e.message);

        // Fallback jokes if API fails
        const fallbackJokes = [
            "Why don't scientists trust atoms?\nBecause they make up everything! 😄",
            "Why did the scarecrow win an award?\nBecause he was outstanding in his field! 🌾",
            "What do you call a fake noodle?\nAn impasta! 🍝",
            "Why did the bicycle fall over?\nBecause it was two-tired! 🚲",
            "What do you call cheese that isn't yours?\nNacho cheese! 🧀"
        ];

        const random = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
        await sock.sendMessage(chatId, {
            text: `😂 *Joke*\n\n${random}`
        }, { quoted: message });
    }
}

module.exports = jokeCommand;
