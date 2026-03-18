/**
 * ScottyMd — .quickpoll command
 * Quick yes/no poll
 * © ScottyMd by Scotty
 */
async function quickPollCommand(sock, chatId, message, args) {
    try {
        const question = args.join(' ').trim();
        if (!question) return await sock.sendMessage(chatId, { text: '❌ Usage: .quickpoll <question>\nExample: .quickpoll Should we change the group name?' }, { quoted: message });
        try {
            await sock.sendMessage(chatId, { poll: { name: question, values: ['✅ Yes', '❌ No', '🤷 Maybe'], selectableCount: 1 } });
        } catch {
            await sock.sendMessage(chatId, { text: `📊 *Quick Poll*\n\n❓ ${question}\n\n✅ Yes\n❌ No\n🤷 Maybe\n\n_React with your choice!_\n_© ScottyMd_` }, { quoted: message });
        }
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}
module.exports = quickPollCommand;
