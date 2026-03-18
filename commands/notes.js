/**
 * ScottyMd — .note .getnote .delnote .notes
 * Save and retrieve notes in groups
 * © ScottyMd by Scotty
 */
const fs = require('fs');
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');
const FILE = './data/notes.json';
function getData() { try { return JSON.parse(fs.readFileSync(FILE,'utf8')); } catch { return {}; } }
function saveData(d) { try { fs.writeFileSync(FILE, JSON.stringify(d,null,2)); } catch {} }

async function noteCommand(sock, chatId, message, args) {
    if (args.length < 2) return await sock.sendMessage(chatId, { text: '❌ Usage: .note <name> <content>\nExample: .note rules No spamming!' }, { quoted: message });
    const senderId = getSender(sock, message);
    if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
    const name = args[0].toLowerCase(); const content = args.slice(1).join(' ');
    const data = getData(); if (!data[chatId]) data[chatId] = {};
    data[chatId][name] = { content, by: senderId, at: new Date().toISOString() };
    saveData(data);
    await sock.sendMessage(chatId, { text: `✅ Note *${name}* saved!\nGet it with: .getnote ${name}` }, { quoted: message });
}

async function getNoteCommand(sock, chatId, message, args) {
    const name = args[0]?.toLowerCase();
    if (!name) return await sock.sendMessage(chatId, { text: '❌ Usage: .getnote <name>' }, { quoted: message });
    const data = getData(); const note = data[chatId]?.[name];
    if (!note) return await sock.sendMessage(chatId, { text: `❌ Note *${name}* not found. Use .notes to see all notes.` }, { quoted: message });
    await sock.sendMessage(chatId, { text: `📝 *${name}*\n\n${note.content}\n\n_© ScottyMd by Scotty_` }, { quoted: message });
}

async function delNoteCommand(sock, chatId, message, args) {
    const senderId = getSender(sock, message);
    if (!await isAdmin(sock, chatId, senderId) && !isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Admins only.' }, { quoted: message });
    const name = args[0]?.toLowerCase();
    if (!name) return await sock.sendMessage(chatId, { text: '❌ Usage: .delnote <name>' }, { quoted: message });
    const data = getData();
    if (!data[chatId]?.[name]) return await sock.sendMessage(chatId, { text: `❌ Note *${name}* not found.` }, { quoted: message });
    delete data[chatId][name]; saveData(data);
    await sock.sendMessage(chatId, { text: `✅ Note *${name}* deleted.` }, { quoted: message });
}

async function notesListCommand(sock, chatId, message) {
    const data = getData(); const notes = data[chatId];
    if (!notes || !Object.keys(notes).length) return await sock.sendMessage(chatId, { text: '📝 No notes saved yet.\nUse .note <name> <content> to add one.' }, { quoted: message });
    let text = `📝 *Saved Notes*\n\n`;
    Object.keys(notes).forEach(n => { text += `• *${n}*\n`; });
    text += `\nUse .getnote <name> to retrieve.\n_© ScottyMd by Scotty_`;
    await sock.sendMessage(chatId, { text }, { quoted: message });
}

module.exports = { noteCommand, getNoteCommand, delNoteCommand, notesListCommand };
