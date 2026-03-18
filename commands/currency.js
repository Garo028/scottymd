/**
 * ScottyMd — .currency command
 * Real-time currency conversion (free API)
 * © @Scottymd
 */
const axios = require('axios');

async function currencyCommand(sock, chatId, message, args) {
    try {
        // Usage: .currency 100 USD ZWL
        if (args.length < 3) {
            return await sock.sendMessage(chatId, {
                text: '❌ Usage: .currency <amount> <from> <to>\nExample: .currency 100 USD ZWL\nExample: .currency 50 GBP USD'
            }, { quoted: message });
        }
        const amount = parseFloat(args[0]);
        const from   = args[1].toUpperCase();
        const to     = args[2].toUpperCase();

        if (isNaN(amount)) return await sock.sendMessage(chatId, { text: '❌ Amount must be a number.' }, { quoted: message });

        const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`, { timeout: 10000 });
        const rate = res.data.rates[to];

        if (!rate) return await sock.sendMessage(chatId, { text: `❌ Currency code *${to}* not found.` }, { quoted: message });

        const result = (amount * rate).toFixed(2);

        await sock.sendMessage(chatId, {
            text: `💱 *Currency Conversion*\n\n💵 ${amount} *${from}* = 💰 *${result} ${to}*\n\n📊 Rate: 1 ${from} = ${rate.toFixed(4)} ${to}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Conversion failed. Check currency codes and try again.' }, { quoted: message });
    }
}
module.exports = currencyCommand;
