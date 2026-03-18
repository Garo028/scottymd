/**
 * ScottyMd — 40 New Commands Bundle
 * © ScottyMd by Scotty
 */
const fs    = require('fs');
const axios = require('axios');
const isAdmin = require('../lib/isAdmin');
const { isBotAdmin } = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

// ── .flip — Coin flip ─────────────────────────────────────────────────────────
async function flipCommand(sock, chatId, message) {
    const result = Math.random() < 0.5 ? '🪙 *HEADS*' : '🪙 *TAILS*';
    await sock.sendMessage(chatId, { text: `${result}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

// ── .dice — Roll a dice ───────────────────────────────────────────────────────
async function diceCommand(sock, chatId, message, args) {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 100) return await sock.sendMessage(chatId, { text: '❌ Sides must be between 2-100' }, { quoted: message });
    const roll = Math.floor(Math.random() * sides) + 1;
    await sock.sendMessage(chatId, { text: `🎲 *Dice Roll (d${sides})*\n\nResult: *${roll}*\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

// ── .rng — Random number ──────────────────────────────────────────────────────
async function rngCommand(sock, chatId, message, args) {
    const min = parseInt(args[0]) || 1;
    const max = parseInt(args[1]) || 100;
    if (min >= max) return await sock.sendMessage(chatId, { text: '❌ Usage: .rng <min> <max>\nExample: .rng 1 100' }, { quoted: message });
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    await sock.sendMessage(chatId, { text: `🔢 *Random Number*\nRange: ${min} - ${max}\nResult: *${result}*\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

// ── .choose — Pick random option ──────────────────────────────────────────────
async function chooseCommand(sock, chatId, message, args) {
    const options = args.join(' ').split(',').map(s => s.trim()).filter(Boolean);
    if (options.length < 2) return await sock.sendMessage(chatId, { text: '❌ Usage: .choose option1, option2, option3' }, { quoted: message });
    const pick = options[Math.floor(Math.random() * options.length)];
    await sock.sendMessage(chatId, { text: `🎯 *I choose...*\n\n*${pick}*\n\n_From: ${options.join(', ')}_\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

// ── .reverse — Reverse text ───────────────────────────────────────────────────
async function reverseCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .reverse <text>' }, { quoted: message });
    await sock.sendMessage(chatId, { text: `🔄 *Reversed:*\n${text.split('').reverse().join('')}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

// ── .upper — Uppercase text ───────────────────────────────────────────────────
async function upperCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .upper <text>' }, { quoted: message });
    await sock.sendMessage(chatId, { text: text.toUpperCase() }, { quoted: message });
}

// ── .lower — Lowercase text ───────────────────────────────────────────────────
async function lowerCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .lower <text>' }, { quoted: message });
    await sock.sendMessage(chatId, { text: text.toLowerCase() }, { quoted: message });
}

// ── .count — Count characters/words ──────────────────────────────────────────
async function countCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .count <text>' }, { quoted: message });
    const chars  = text.length;
    const words  = text.split(/\s+/).filter(Boolean).length;
    const lines  = text.split('\n').length;
    await sock.sendMessage(chatId, {
        text: `📊 *Text Counter*\n\n📝 Characters: *${chars}*\n💬 Words: *${words}*\n📄 Lines: *${lines}*\n\n_© ScottyMd by Scotty_`
    }, { quoted: message });
}

// ── .password — Generate strong password ─────────────────────────────────────
async function passwordCommand(sock, chatId, message, args) {
    const length = Math.min(parseInt(args[0]) || 16, 64);
    const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < length; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    await sock.sendMessage(chatId, {
        text: `🔐 *Generated Password*\n\n\`${pass}\`\n\nLength: ${length} chars\n\n_Do not share this with anyone!_\n_© ScottyMd by Scotty_`
    }, { quoted: message });
}

// ── .encode — Base64 encode ───────────────────────────────────────────────────
async function encodeCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .encode <text>' }, { quoted: message });
    const encoded = Buffer.from(text).toString('base64');
    await sock.sendMessage(chatId, { text: `🔒 *Base64 Encoded:*\n\n${encoded}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

// ── .decode — Base64 decode ───────────────────────────────────────────────────
async function decodeCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .decode <base64>' }, { quoted: message });
    try {
        const decoded = Buffer.from(text, 'base64').toString('utf8');
        await sock.sendMessage(chatId, { text: `🔓 *Base64 Decoded:*\n\n${decoded}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Invalid base64 string.' }, { quoted: message });
    }
}

// ── .time — Current time in any timezone ─────────────────────────────────────
async function timeCommand(sock, chatId, message, args) {
    const tz = args.join(' ').trim() || 'Africa/Harare';
    try {
        const now = new Date();
        const timeStr = now.toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'long' });
        await sock.sendMessage(chatId, {
            text: `🕐 *Current Time*\n\n📍 Zone: ${tz}\n🕐 Time: ${timeStr}\n\n_© ScottyMd by Scotty_`
        }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ Invalid timezone: ${tz}\nExample: .time Africa/Harare\n.time America/New_York\n.time Europe/London` }, { quoted: message });
    }
}

// ── .age — Calculate age ──────────────────────────────────────────────────────
async function ageCommand(sock, chatId, message, args) {
    const dob = args.join(' ').trim();
    if (!dob) return await sock.sendMessage(chatId, { text: '❌ Usage: .age DD/MM/YYYY\nExample: .age 15/03/2000' }, { quoted: message });
    try {
        const parts = dob.split('/');
        const birth = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (isNaN(birth.getTime())) throw new Error('Invalid date');
        const now   = new Date();
        let age     = now.getFullYear() - birth.getFullYear();
        const m     = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
        const daysLeft = Math.ceil((nextBday - now) / 86400000);
        await sock.sendMessage(chatId, {
            text: `🎂 *Age Calculator*\n\n📅 DOB: ${dob}\n🎉 Age: *${age} years old*\n⏳ Next birthday in: *${daysLeft} days*\n\n_© ScottyMd by Scotty_`
        }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Invalid date. Format: DD/MM/YYYY' }, { quoted: message });
    }
}

// ── .rate — Rate something random ────────────────────────────────────────────
async function rateCommand(sock, chatId, message, args) {
    const thing = args.join(' ').trim();
    if (!thing) return await sock.sendMessage(chatId, { text: '❌ Usage: .rate <anything>' }, { quoted: message });
    // Consistent rating based on text content
    let hash = 0;
    for (let i = 0; i < thing.length; i++) hash = ((hash << 5) - hash) + thing.charCodeAt(i);
    const score = Math.abs(hash) % 11;
    const bar   = '█'.repeat(score) + '░'.repeat(10 - score);
    const emoji = score >= 8 ? '🔥' : score >= 5 ? '👍' : '😐';
    await sock.sendMessage(chatId, {
        text: `${emoji} *Rating: ${thing}*\n\n${bar} *${score}/10*\n\n_© ScottyMd by Scotty_`
    }, { quoted: message });
}

// ── .hack — Fake hacking animation ───────────────────────────────────────────
async function hackCommand(sock, chatId, message, args) {
    const target = args.join(' ') || 'Unknown Target';
    const steps = [
        `💻 Initializing hack on *${target}*...`,
        `🔍 Scanning ports...\n[██░░░░░░░░] 20%`,
        `🔓 Bypassing firewall...\n[████░░░░░░] 40%`,
        `💾 Extracting data...\n[██████░░░░] 60%`,
        `🔑 Cracking passwords...\n[████████░░] 80%`,
        `✅ *HACK COMPLETE!*\n\n🎭 Just kidding lol 😂\n_This is just for fun!_\n\n_© ScottyMd by Scotty_`
    ];
    let sent = await sock.sendMessage(chatId, { text: steps[0] }, { quoted: message });
    for (let i = 1; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 1500));
        await sock.sendMessage(chatId, { text: steps[i], edit: sent.key });
    }
}

// ── .quote (with author) ──────────────────────────────────────────────────────
async function motivateCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://api.quotable.io/random?tags=motivational', { timeout: 8000 });
        await sock.sendMessage(chatId, {
            text: `💪 *Motivation*\n\n_"${res.data.content}"_\n\n— *${res.data.author}*\n\n_© ScottyMd by Scotty_`
        }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: '💪 *Keep going — every day is a new chance to improve!*\n\n_© ScottyMd by Scotty_' }, { quoted: message });
    }
}

// ── .dadjoke ──────────────────────────────────────────────────────────────────
async function dadJokeCommand(sock, chatId, message) {
    try {
        const res = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' }, timeout: 8000 });
        await sock.sendMessage(chatId, { text: `👨 *Dad Joke*\n\n${res.data.joke}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: '👨 *Dad Joke*\n\nI used to hate facial hair, but then it grew on me.\n\n_© ScottyMd by Scotty_' }, { quoted: message });
    }
}

// ── .today — Today in history ─────────────────────────────────────────────────
async function todayCommand(sock, chatId, message) {
    try {
        const now   = new Date();
        const month = now.getMonth() + 1;
        const day   = now.getDate();
        const res   = await axios.get(`https://history.muffinlabs.com/date/${month}/${day}`, { timeout: 10000 });
        const events = res.data.data.Events.slice(0, 5);
        let text = `📅 *Today in History (${day}/${month})*\n\n`;
        events.forEach(e => { text += `• *${e.year}:* ${e.text}\n\n`; });
        text += `_© ScottyMd by Scotty_`;
        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Could not fetch history data.' }, { quoted: message });
    }
}

// ── .urban — Urban dictionary ─────────────────────────────────────────────────
async function urbanCommand(sock, chatId, message, args) {
    const word = args.join(' ').trim();
    if (!word) return await sock.sendMessage(chatId, { text: '❌ Usage: .urban <word>' }, { quoted: message });
    try {
        const res  = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`, { timeout: 10000 });
        const def  = res.data.list[0];
        if (!def) return await sock.sendMessage(chatId, { text: `❌ No definition found for *${word}*` }, { quoted: message });
        const defn = def.definition.replace(/\[|\]/g, '').slice(0, 500);
        const ex   = def.example?.replace(/\[|\]/g, '').slice(0, 200) || '';
        await sock.sendMessage(chatId, {
            text: `📖 *Urban Dictionary: ${word}*\n\n${defn}${ex ? '\n\n💬 *Example:*\n' + ex : ''}\n\n👍 ${def.thumbs_up} | 👎 ${def.thumbs_down}\n\n_© ScottyMd by Scotty_`
        }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Urban Dictionary lookup failed.' }, { quoted: message });
    }
}

// ── .announce — Send announcement ────────────────────────────────────────────
async function announceCommand(sock, chatId, message, args) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
    const senderId = getSender(sock, message);
    if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
    const text = args.join(' ').trim();
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .announce <message>' }, { quoted: message });
    const meta = await sock.groupMetadata(chatId);
    const mentions = meta.participants.map(p => p.id);
    await sock.sendMessage(chatId, {
        text: `📢 *ANNOUNCEMENT*\n\n${text}\n\n_© ScottyMd by Scotty_`,
        mentions
    });
}

// ── .lock / .unlock group settings ───────────────────────────────────────────
async function lockCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
    const senderId = getSender(sock, message);
    if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
    if (!await isBotAdmin(sock, chatId)) return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });
    await sock.groupSettingUpdate(chatId, 'locked');
    await sock.sendMessage(chatId, { text: '🔒 *Group settings locked.* Only admins can edit group info now.' }, { quoted: message });
}

async function unlockCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
    const senderId = getSender(sock, message);
    if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
    if (!await isBotAdmin(sock, chatId)) return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });
    await sock.groupSettingUpdate(chatId, 'unlocked');
    await sock.sendMessage(chatId, { text: '🔓 *Group settings unlocked.* All members can now edit group info.' }, { quoted: message });
}

// ── .kick all non-admins ──────────────────────────────────────────────────────
async function kickallCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
    const senderId = getSender(sock, message);
    if (!isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Owner only — this is a dangerous command.' }, { quoted: message });
    if (!await isBotAdmin(sock, chatId)) return await sock.sendMessage(chatId, { text: '❌ Make me an admin first.' }, { quoted: message });
    const meta    = await sock.groupMetadata(chatId);
    const members = meta.participants.filter(p => !p.admin).map(p => p.id);
    if (!members.length) return await sock.sendMessage(chatId, { text: '✅ No regular members to kick.' }, { quoted: message });
    await sock.sendMessage(chatId, { text: `⚠️ Kicking ${members.length} non-admin members...` });
    for (const m of members) {
        try { await sock.groupParticipantsUpdate(chatId, [m], 'remove'); await new Promise(r => setTimeout(r, 500)); } catch {}
    }
    await sock.sendMessage(chatId, { text: `✅ Kicked ${members.length} members.\n\n_© ScottyMd by Scotty_` });
}

// ── .whois — Get info about a mentioned user ──────────────────────────────────
async function whoisCommand(sock, chatId, message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const qp = message.message?.extendedTextMessage?.contextInfo?.participant;
    if (qp && !mentioned.includes(qp)) mentioned.push(qp);
    const target = mentioned[0] || getSender(sock, message);
    const num    = target.replace('@s.whatsapp.net','').replace(/[^0-9]/g,'');
    let status = 'Hidden';
    try { const s = await sock.fetchStatus(target); if (s?.status) status = s.status; } catch {}
    let role = 'User';
    if (chatId.endsWith('@g.us')) {
        try {
            const meta = await sock.groupMetadata(chatId);
            const p = meta.participants.find(x => x.id.includes(num));
            if (p?.admin === 'superadmin') role = '👑 Group Owner';
            else if (p?.admin === 'admin') role = '⭐ Admin';
            else role = '👤 Member';
        } catch {}
    }
    if (isOwnerOrSudo(target)) role += ' | 🔑 Bot Owner';
    await sock.sendMessage(chatId, {
        text: `👤 *User Info*\n\n📱 Number: +${num}\n🏷️ Role: ${role}\n💬 Status: ${status}\n\n_© ScottyMd by Scotty_`,
        mentions: [target]
    }, { quoted: message });
}

// ── .clearchat — Clear bot's messages (owner) ─────────────────────────────────
async function clearchatCommand(sock, chatId, message) {
    const senderId = getSender(sock, message);
    if (!isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Owner only.' }, { quoted: message });
    await sock.sendMessage(chatId, { text: '🧹 Chat clear is handled by WhatsApp directly. Use WhatsApp → Clear Chat to clear messages.\n\n_© ScottyMd by Scotty_' }, { quoted: message });
}

// ── .afk — Away from keyboard ─────────────────────────────────────────────────
const afkUsers = new Map();
async function afkCommand(sock, chatId, message, args) {
    const senderId = getSender(sock, message);
    const reason   = args.join(' ') || 'AFK';
    afkUsers.set(senderId, { reason, time: Date.now() });
    await sock.sendMessage(chatId, {
        text: `😴 @${senderId.split('@')[0]} is now *AFK*\nReason: ${reason}\n\n_© ScottyMd by Scotty_`,
        mentions: [senderId]
    }, { quoted: message });
}

function checkAfk(senderId) { return afkUsers.get(senderId) || null; }
function clearAfk(senderId) { afkUsers.delete(senderId); }

// ── .spell — Check if word exists ────────────────────────────────────────────
async function spellCommand(sock, chatId, message, args) {
    const word = args[0]?.trim().toLowerCase();
    if (!word) return await sock.sendMessage(chatId, { text: '❌ Usage: .spell <word>' }, { quoted: message });
    try {
        await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 8000 });
        await sock.sendMessage(chatId, { text: `✅ *${word}* is spelled correctly!\n\n_© ScottyMd by Scotty_` }, { quoted: message });
    } catch {
        await sock.sendMessage(chatId, { text: `❌ *${word}* may be misspelled or not found in dictionary.\n\n_© ScottyMd by Scotty_` }, { quoted: message });
    }
}

// ── .font — Convert text to fancy font ───────────────────────────────────────
async function fontCommand(sock, chatId, message, args) {
    const text = args.slice(1).join(' ').trim();
    const type = args[0]?.toLowerCase();
    if (!text || !type) return await sock.sendMessage(chatId, { text: '❌ Usage: .font <type> <text>\nTypes: bold, italic, mono, bubble\nExample: .font bold Hello World' }, { quoted: message });
    const maps = {
        bold:   { a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳',A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙' },
        italic: { a:'𝑎',b:'𝑏',c:'𝑐',d:'𝑑',e:'𝑒',f:'𝑓',g:'𝑔',h:'ℎ',i:'𝑖',j:'𝑗',k:'𝑘',l:'𝑙',m:'𝑚',n:'𝑛',o:'𝑜',p:'𝑝',q:'𝑞',r:'𝑟',s:'𝑠',t:'𝑡',u:'𝑢',v:'𝑣',w:'𝑤',x:'𝑥',y:'𝑦',z:'𝑧' },
        mono:   { a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣' }
    };
    if (!maps[type]) return await sock.sendMessage(chatId, { text: '❌ Available fonts: bold, italic, mono' }, { quoted: message });
    const map    = maps[type];
    const result = text.split('').map(c => map[c] || c).join('');
    await sock.sendMessage(chatId, { text: result + '\n\n_© ScottyMd by Scotty_' }, { quoted: message });
}

// ── .ascii — ASCII art text ───────────────────────────────────────────────────
async function asciiCommand(sock, chatId, message, args) {
    const text = args.join(' ').trim().toUpperCase().slice(0, 10);
    if (!text) return await sock.sendMessage(chatId, { text: '❌ Usage: .ascii <text>' }, { quoted: message });
    // Simple block letters
    const blockMap = {
        'H': ['█ █','███','█ █'], 'E': ['███','██ ','███'], 'L': ['█  ','█  ','███'],
        'O': ['███','█ █','███'], 'W': ['█ █','█ █','███'], 'R': ['██ ','███','█ █'],
        'D': ['██ ','█ █','██ '], 'A': [' █ ','███','█ █'], 'I': ['███',' █ ','███'],
    };
    let lines = ['', '', ''];
    for (const ch of text) {
        const b = blockMap[ch] || ['? ','? ','? '];
        lines[0] += (b[0] || '   ') + '  ';
        lines[1] += (b[1] || '   ') + '  ';
        lines[2] += (b[2] || '   ') + '  ';
    }
    await sock.sendMessage(chatId, { text: '```\n' + lines.join('\n') + '\n```\n\n_© ScottyMd by Scotty_' }, { quoted: message });
}

// ── .love — Love calculator ───────────────────────────────────────────────────
async function loveCommand(sock, chatId, message, args) {
    const names = args.join(' ').split('&').map(s => s.trim());
    if (names.length < 2) return await sock.sendMessage(chatId, { text: '❌ Usage: .love Name1 & Name2\nExample: .love John & Jane' }, { quoted: message });
    let hash = 0;
    for (const c of (names[0] + names[1]).toLowerCase()) hash = ((hash << 5) - hash) + c.charCodeAt(0);
    const score  = Math.abs(hash) % 101;
    const bar    = '█'.repeat(Math.round(score/10)) + '░'.repeat(10 - Math.round(score/10));
    const emoji  = score > 80 ? '💘' : score > 50 ? '💕' : score > 30 ? '💛' : '💔';
    await sock.sendMessage(chatId, {
        text: `${emoji} *Love Calculator*\n\n💑 ${names[0]} & ${names[1]}\n\n${bar} *${score}%*\n\n${score > 80 ? 'Made for each other! 😍' : score > 50 ? 'Good match! 💞' : score > 30 ? 'Could work! 🤔' : 'Keep looking... 💀'}\n\n_© ScottyMd by Scotty_`
    }, { quoted: message });
}

// ── .zodiac — Zodiac sign info ────────────────────────────────────────────────
async function zodiacCommand(sock, chatId, message, args) {
    const name = args.join(' ').trim().toLowerCase();
    const signs = {
        aries:{emoji:'♈',dates:'Mar 21 – Apr 19',trait:'Bold & Ambitious'},
        taurus:{emoji:'♉',dates:'Apr 20 – May 20',trait:'Reliable & Patient'},
        gemini:{emoji:'♊',dates:'May 21 – Jun 20',trait:'Witty & Curious'},
        cancer:{emoji:'♋',dates:'Jun 21 – Jul 22',trait:'Intuitive & Caring'},
        leo:{emoji:'♌',dates:'Jul 23 – Aug 22',trait:'Creative & Passionate'},
        virgo:{emoji:'♍',dates:'Aug 23 – Sep 22',trait:'Analytical & Kind'},
        libra:{emoji:'♎',dates:'Sep 23 – Oct 22',trait:'Diplomatic & Fair'},
        scorpio:{emoji:'♏',dates:'Oct 23 – Nov 21',trait:'Brave & Resourceful'},
        sagittarius:{emoji:'♐',dates:'Nov 22 – Dec 21',trait:'Generous & Idealistic'},
        capricorn:{emoji:'♑',dates:'Dec 22 – Jan 19',trait:'Disciplined & Responsible'},
        aquarius:{emoji:'♒',dates:'Jan 20 – Feb 18',trait:'Progressive & Original'},
        pisces:{emoji:'♓',dates:'Feb 19 – Mar 20',trait:'Compassionate & Artistic'}
    };
    const sign = signs[name];
    if (!sign) return await sock.sendMessage(chatId, { text: '❌ Usage: .zodiac <sign>\nSigns: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces' }, { quoted: message });
    await sock.sendMessage(chatId, {
        text: `${sign.emoji} *${name.charAt(0).toUpperCase() + name.slice(1)}*\n\n📅 Dates: ${sign.dates}\n✨ Trait: ${sign.trait}\n\n_© ScottyMd by Scotty_`
    }, { quoted: message });
}

// ── .react — React to a message ───────────────────────────────────────────────
async function reactCommand(sock, chatId, message, args) {
    const emoji = args[0] || '👍';
    const ctx   = message.message?.extendedTextMessage?.contextInfo;
    if (!ctx?.stanzaId) return await sock.sendMessage(chatId, { text: '❌ Reply to a message with .react <emoji>' }, { quoted: message });
    try {
        await sock.sendMessage(chatId, {
            react: { text: emoji, key: { remoteJid: chatId, id: ctx.stanzaId, participant: ctx.participant } }
        });
    } catch {
        await sock.sendMessage(chatId, { text: '❌ Could not react to that message.' }, { quoted: message });
    }
}

// ── .listadmins ───────────────────────────────────────────────────────────────
async function listAdminsCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ Groups only.' }, { quoted: message });
    const { getAdmins } = require('../lib/isAdmin');
    const admins   = await getAdmins(sock, chatId);
    const meta     = await sock.groupMetadata(chatId);
    const mentions = admins;
    let text = `⭐ *Group Admins (${meta.subject})*\n\n`;
    admins.forEach(a => { text += `• @${a.split('@')[0]}\n`; });
    text += `\n_Total: ${admins.length}_\n_© ScottyMd by Scotty_`;
    await sock.sendMessage(chatId, { text, mentions }, { quoted: message });
}

module.exports = {
    flipCommand, diceCommand, rngCommand, chooseCommand,
    reverseCommand, upperCommand, lowerCommand, countCommand,
    passwordCommand, encodeCommand, decodeCommand, timeCommand,
    ageCommand, rateCommand, hackCommand, motivateCommand,
    dadJokeCommand, todayCommand, urbanCommand, announceCommand,
    lockCommand, unlockCommand, kickallCommand, whoisCommand,
    clearchatCommand, afkCommand, checkAfk, clearAfk,
    spellCommand, fontCommand, asciiCommand, loveCommand,
    zodiacCommand, reactCommand, listAdminsCommand
};
