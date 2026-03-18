/**
 * ScottyMd - .weather command
 * Gets current weather for any city (uses free wttr.in API)
 */
const axios = require('axios');

async function weatherCommand(sock, chatId, message, args) {
    try {
        const city = args.join(' ').trim();

        if (!city) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a city name.\n\n*Usage:* .weather Harare\n.weather New York'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: `🌍 Fetching weather for *${city}*...` }, { quoted: message });

        // Using wttr.in free weather API (no key needed)
        const encodedCity = encodeURIComponent(city);
        const url = `https://wttr.in/${encodedCity}?format=j1`;

        const response = await axios.get(url, {
            timeout: 10000,
            headers: { 'User-Agent': 'curl/7.68.0' }
        });

        const data = response.data;
        const current = data.current_condition[0];
        const area = data.nearest_area[0];

        const areaName = area.areaName[0].value;
        const country = area.country[0].value;
        const tempC = current.temp_C;
        const tempF = current.temp_F;
        const feelsC = current.FeelsLikeC;
        const humidity = current.humidity;
        const windKmph = current.windspeedKmph;
        const windDir = current.winddir16Point;
        const visibility = current.visibility;
        const desc = current.weatherDesc[0].value;
        const uvIndex = current.uvIndex;

        // Weather emoji based on description
        const emoji = getWeatherEmoji(desc);

        const weatherText = `
${emoji} *Weather in ${areaName}, ${country}*

🌡️ *Temperature:* ${tempC}°C / ${tempF}°F
🤔 *Feels Like:* ${feelsC}°C
💧 *Humidity:* ${humidity}%
💨 *Wind:* ${windKmph} km/h ${windDir}
👁️ *Visibility:* ${visibility} km
☀️ *UV Index:* ${uvIndex}
🌤️ *Condition:* ${desc}

_Data from wttr.in_
`.trim();

        await sock.sendMessage(chatId, {
            text: weatherText
        }, { quoted: message });

    } catch (e) {
        console.error('Weather error:', e.message);
        if (e.response?.status === 404) {
            await sock.sendMessage(chatId, {
                text: `❌ City "*${args.join(' ')}*" not found. Please check the spelling.`
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Could not fetch weather. Please try again.'
            }, { quoted: message });
        }
    }
}

function getWeatherEmoji(desc) {
    const d = desc.toLowerCase();
    if (d.includes('sunny') || d.includes('clear')) return '☀️';
    if (d.includes('cloud')) return '☁️';
    if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
    if (d.includes('thunder') || d.includes('storm')) return '⛈️';
    if (d.includes('snow') || d.includes('sleet')) return '❄️';
    if (d.includes('fog') || d.includes('mist')) return '🌫️';
    if (d.includes('wind')) return '💨';
    if (d.includes('partly')) return '⛅';
    return '🌡️';
}

module.exports = weatherCommand;
