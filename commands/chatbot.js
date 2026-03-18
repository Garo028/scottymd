/**
 * ScottyMd — .chatbot command + auto-response
 * Enables AI chatbot mode in group/DM
 * © @Scottymd
 */
const fs  = require('fs');
const axios = require('axios');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

const FILE = './data/chatbot.json';

function getData() { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; } }
function saveData(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

async function chatbotCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        const isGroup  = chatId.endsWith('@g.us');

        if (isGroup && !await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) {
            return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
        }

        const data = getData();
        const sub  = args[0]?.toLowerCase();

        if (!sub || sub === 'status') {
            const status = data[chatId]?.enabled ? '✅ ON' : '❌ OFF';
            return await sock.sendMessage(chatId, {
                text: `🤖 *Chatbot Mode*\nStatus: ${status}\n\n.chatbot on — Enable\n.chatbot off — Disable\n\n_When on, I'll respond to every message in this chat._`
            }, { quoted: message });
        }

        if (sub === 'on') {
            data[chatId] = { enabled: true };
            saveData(data);
            return await sock.sendMessage(chatId, { text: '🤖 Chatbot mode *enabled*! I will respond to all messages.' }, { quoted: message });
        }

        if (sub === 'off') {
            data[chatId] = { enabled: false };
            saveData(data);
            return await sock.sendMessage(chatId, { text: '🤖 Chatbot mode *disabled*.' }, { quoted: message });
        }
    } catch (e) {
        console.error('Chatbot command error:', e.message);
    }
}

async function handleChatbotResponse(sock, chatId, message, text) {
    try {
        const data   = getData();
        const config = data[chatId];
        if (!config?.enabled) return;
        if (!text || text.startsWith('.')) return;

        // Use same free AI API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
            {
                inputs: `<s>[INST] ${text} [/INST]`,
                parameters: { max_new_tokens: 200, temperature: 0.7, return_full_text: false }
            },
            { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
        );

        let reply = '';
        if (Array.isArray(response.data) && response.data[0]?.generated_text) {
            reply = response.data[0].generated_text.trim();
        } else if (response.data?.generated_text) {
            reply = response.data.generated_text.trim();
        }

        reply = reply.replace(/<\/?s>/g, '').replace(/\[INST\]|\[\/INST\]/g, '').trim();
        if (!reply) return;

        await sock.sendMessage(chatId, { text: reply }, { quoted: message });
    } catch (e) {
        // Silently fail — don't spam with errors in chatbot mode
    }
}

module.exports = { chatbotCommand, handleChatbotResponse };
