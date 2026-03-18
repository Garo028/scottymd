/**
 * ScottyMd — .bc2 broadcast to all groups bot is in
 * © ScottyMd by Scotty
 */
const isOwnerOrSudo = require('../lib/isOwner');
const { getSender } = require('../lib/getSender');

async function broadcastGroupsCommand(sock, chatId, message, args) {
    try {
        const senderId = getSender(sock, message);
        if (!isOwnerOrSudo(senderId)) return await sock.sendMessage(chatId, { text: '❌ Owner only.' }, { quoted: message });
        const msg = args.join(' ').trim();
        if (!msg) return await sock.sendMessage(chatId, { text: '❌ Usage: .bcgroups <message>' }, { quoted: message });
        const groups = await sock.groupFetchAllParticipating();
        const list   = Object.keys(groups);
        await sock.sendMessage(chatId, { text: `📤 Broadcasting to *${list.length}* groups...` }, { quoted: message });
        let sent = 0, failed = 0;
        for (const gid of list) {
            try { await sock.sendMessage(gid, { text: `📢 *Broadcast*\n\n${msg}\n\n_© ScottyMd by Scotty_` }); sent++; await new Promise(r=>setTimeout(r,800)); } catch { failed++; }
        }
        await sock.sendMessage(chatId, { text: `✅ Done!\n✔️ Sent: ${sent}\n❌ Failed: ${failed}` }, { quoted: message });
    } catch (e) { await sock.sendMessage(chatId, { text: '❌ Error: ' + e.message }, { quoted: message }); }
}
module.exports = broadcastGroupsCommand;
