/**
 * ScottyMd — .pair command
 * Lets any user pair their number to the bot session
 * Usage: .pair <number>
 * © @Scottymd
 */
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs   = require('fs');
const NodeCache = require('node-cache');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

// Track active pairing sessions
const activePairings = new Map();

async function pairCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);

        // Only owner can trigger bot-level pairing
        if (!isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only the bot owner can use the .pair command.'
            }, { quoted: message });
        }

        let phone = args[0]?.replace(/[^0-9]/g, '') || '';

        if (!phone) {
            return await sock.sendMessage(chatId, {
                text: `📱 *Pair a Number to ScottyMd*\n\n*Usage:* .pair <number>\n*Example:* .pair 263788114185\n\n_Enter the full number with country code, no + or spaces._`
            }, { quoted: message });
        }

        if (phone.length < 7 || phone.length > 15) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid number. Use full international format.\nExample: .pair 263788114185'
            }, { quoted: message });
        }

        if (activePairings.has(phone)) {
            return await sock.sendMessage(chatId, {
                text: `⏳ A pairing request is already active for +${phone}. Please wait.`
            }, { quoted: message });
        }

        activePairings.set(phone, true);

        await sock.sendMessage(chatId, {
            text: `📱 *Requesting pairing code for +${phone}...*\n\n⏳ Please wait a few seconds.`
        }, { quoted: message });

        try {
            // Request pairing code using the EXISTING sock (same session)
            let code = await sock.requestPairingCode(phone);
            code = code?.match(/.{1,4}/g)?.join('-') || code;

            activePairings.delete(phone);

            await sock.sendMessage(chatId, {
                text: `✅ *Pairing Code for +${phone}*\n\n🔐 Code: *${code}*\n\n*Steps:*\n1️⃣ Open WhatsApp on your phone\n2️⃣ Tap Settings → Linked Devices\n3️⃣ Tap Link a Device\n4️⃣ Choose Link with phone number\n5️⃣ Enter: *${code}*\n\n⏰ _Code expires in 60 seconds_\n\n_© @Scottymd_`
            }, { quoted: message });

        } catch (err) {
            activePairings.delete(phone);
            await sock.sendMessage(chatId, {
                text: `❌ Failed to get pairing code for +${phone}\n\nReason: ${err.message}\n\nMake sure the number is registered on WhatsApp.`
            }, { quoted: message });
        }

    } catch (e) {
        console.error('Pair command error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Pair command failed: ' + e.message }, { quoted: message });
    }
}

module.exports = pairCommand;
