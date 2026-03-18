/**
 * ScottyMd - .bc command
 * Broadcasts a message to all known chats / connected users
 */
const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender, getBotJid } = require('../lib/getSender');

const BC_FILE = './data/bc_users.json';

function getBcUsers() {
    try {
        return JSON.parse(fs.readFileSync(BC_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveBcUsers(users) {
    fs.writeFileSync(BC_FILE, JSON.stringify([...new Set(users)], null, 2));
}

// Call this whenever a user sends a message to track them
function addConnectedUser(jid) {
    if (!jid || jid.includes('@g.us') || jid === 'status@broadcast') return;
    const users = getBcUsers();
    if (!users.includes(jid)) {
        users.push(jid);
        saveBcUsers(users);
    }
}

async function bcCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);

        if (!isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only the bot owner can use the broadcast command.'
            }, { quoted: message });
        }

        const broadcastMsg = args.join(' ').trim();

        if (!broadcastMsg) {
            const users = getBcUsers();
            return await sock.sendMessage(chatId, {
                text: `📢 *Broadcast Info*\n\n👥 Connected users: *${users.length}*\n\n*Usage:* .bc Your message here`
            }, { quoted: message });
        }

        const users = getBcUsers();

        if (users.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ No users to broadcast to yet. Users are tracked when they message the bot.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `📤 Broadcasting to *${users.length}* users...`
        }, { quoted: message });

        const text = `📢 *Broadcast Message*\n\n${broadcastMsg}\n\n_— ScottyMd Bot_`;

        let sent = 0;
        let failed = 0;

        for (const user of users) {
            try {
                await sock.sendMessage(user, { text });
                sent++;
                // Small delay to avoid spam detection
                await new Promise(r => setTimeout(r, 500));
            } catch {
                failed++;
            }
        }

        await sock.sendMessage(chatId, {
            text: `✅ *Broadcast complete!*\n\n✔️ Sent: ${sent}\n❌ Failed: ${failed}`
        }, { quoted: message });

    } catch (e) {
        console.error('Broadcast error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Broadcast failed.' }, { quoted: message });
    }
}

module.exports = { bcCommand, addConnectedUser };
