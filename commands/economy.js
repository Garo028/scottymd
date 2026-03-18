/**
 * ScottyMd — Economy system (.balance .daily .pay .rich)
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const { getSender } = require('../lib/getSender');
const FILE = './data/economy.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }
function getUser(data, id) { if (!data[id]) data[id] = { balance: 0, lastDaily: 0 }; return data[id]; }

async function balanceCommand(sock, chatId, message) {
    const senderId = getSender(sock, message);
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || senderId;
    const data = getData(); const user = getUser(data, target);
    await sock.sendMessage(chatId, { text: `💰 *Balance*\n👤 @${target.split('@')[0]}\n\n💵 Wallet: *$${user.balance.toLocaleString()}*\n\n_© ScottyMd by Scotty_`, mentions: [target] }, { quoted: message });
}

async function dailyCommand(sock, chatId, message) {
    const senderId = getSender(sock, message);
    const data = getData(); const user = getUser(data, senderId);
    const now = Date.now(); const last = user.lastDaily || 0;
    const diff = now - last; const ms24h = 24*60*60*1000;
    if (diff < ms24h) {
        const rem = Math.ceil((ms24h - diff) / 3600000);
        return await sock.sendMessage(chatId, { text: `⏰ Come back in *${rem} hour(s)* for your daily reward!` }, { quoted: message });
    }
    const reward = Math.floor(Math.random() * 500) + 100;
    user.balance += reward; user.lastDaily = now;
    saveData(data);
    await sock.sendMessage(chatId, { text: `💸 *Daily Reward!*\n\n+$${reward} added to your wallet!\n💰 Balance: *$${user.balance.toLocaleString()}*\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

async function payCommand(sock, chatId, message, args) {
    if (args.length < 2) return await sock.sendMessage(chatId, { text: '❌ Usage: .pay @user <amount>' }, { quoted: message });
    const senderId = getSender(sock, message);
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!mentioned.length) return await sock.sendMessage(chatId, { text: '❌ Mention someone to pay.' }, { quoted: message });
    const target = mentioned[0]; const amount = parseInt(args[args.length-1]);
    if (isNaN(amount) || amount <= 0) return await sock.sendMessage(chatId, { text: '❌ Invalid amount.' }, { quoted: message });
    const data = getData(); const from = getUser(data, senderId); const to = getUser(data, target);
    if (from.balance < amount) return await sock.sendMessage(chatId, { text: `❌ Insufficient balance. You have $${from.balance}.` }, { quoted: message });
    from.balance -= amount; to.balance += amount; saveData(data);
    await sock.sendMessage(chatId, { text: `✅ *Payment Sent!*\n💸 $${amount} sent to @${target.split('@')[0]}\n💰 Your balance: $${from.balance}`, mentions: [target] }, { quoted: message });
}

async function richCommand(sock, chatId, message) {
    const data = getData();
    const sorted = Object.entries(data).sort(([,a],[,b]) => b.balance - a.balance).slice(0, 10);
    if (!sorted.length) return await sock.sendMessage(chatId, { text: '💰 No one has any money yet! Use .daily to get started.' }, { quoted: message });
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
    const mentions = sorted.map(([id]) => id);
    let text = `💰 *Richest Members*\n\n`;
    sorted.forEach(([id, u], i) => { text += `${medals[i]} @${id.split('@')[0]} — *$${u.balance.toLocaleString()}*\n`; });
    text += `\n_© ScottyMd by Scotty_`;
    await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
}

module.exports = { balanceCommand, dailyCommand, payCommand, richCommand };
