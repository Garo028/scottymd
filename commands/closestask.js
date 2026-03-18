/**
 * ScottyMd — .todo command
 * Simple personal task list
 * © @Scottymd
 */
const fs = require('fs');
const FILE = './data/todos.json';

function getTodos() { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return {}; } }
function saveTodos(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

async function todoCommand(sock, chatId, message, args) {
    try {
        const userId = message.key.fromMe ? chatId : (getSender(sock, message));
        const todos  = getTodos();
        if (!todos[userId]) todos[userId] = [];
        const sub    = args[0]?.toLowerCase();

        if (!sub || sub === 'list') {
            if (!todos[userId].length) return await sock.sendMessage(chatId, { text: '📋 Your todo list is empty.\nAdd tasks: .todo add Buy groceries' }, { quoted: message });
            const list = todos[userId].map((t, i) => `${t.done ? '✅' : '⬜'} ${i + 1}. ${t.task}`).join('\n');
            return await sock.sendMessage(chatId, { text: `📋 *Your Todo List*\n\n${list}\n\n_© @Scottymd_` }, { quoted: message });
        }
        if (sub === 'add') {
            const task = args.slice(1).join(' ');
            if (!task) return await sock.sendMessage(chatId, { text: '❌ Usage: .todo add <task>' }, { quoted: message });
            todos[userId].push({ task, done: false });
            saveTodos(todos);
            return await sock.sendMessage(chatId, { text: `✅ Added: "${task}"\n\n_© @Scottymd_` }, { quoted: message });
        }
        if (sub === 'done') {
            const idx = parseInt(args[1]) - 1;
            if (isNaN(idx) || !todos[userId][idx]) return await sock.sendMessage(chatId, { text: '❌ Invalid task number.' }, { quoted: message });
            todos[userId][idx].done = true;
            saveTodos(todos);
            return await sock.sendMessage(chatId, { text: `✅ Task "${todos[userId][idx].task}" marked as done!\n\n_© @Scottymd_` }, { quoted: message });
        }
        if (sub === 'remove' || sub === 'delete') {
            const idx = parseInt(args[1]) - 1;
            if (isNaN(idx) || !todos[userId][idx]) return await sock.sendMessage(chatId, { text: '❌ Invalid task number.' }, { quoted: message });
            const removed = todos[userId].splice(idx, 1)[0];
            saveTodos(todos);
            return await sock.sendMessage(chatId, { text: `🗑️ Removed: "${removed.task}"\n\n_© @Scottymd_` }, { quoted: message });
        }
        if (sub === 'clear') {
            todos[userId] = [];
            saveTodos(todos);
            return await sock.sendMessage(chatId, { text: '🗑️ Todo list cleared!\n\n_© @Scottymd_' }, { quoted: message });
        }
        await sock.sendMessage(chatId, { text: '❌ Usage:\n.todo list\n.todo add <task>\n.todo done <number>\n.todo remove <number>\n.todo clear' }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Todo command failed.' }, { quoted: message });
    }
}
module.exports = todoCommand;
