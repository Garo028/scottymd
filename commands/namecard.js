/** ScottyMd — .namecard fancy name card © ScottyMd by Scotty */
async function namecardCommand(sock, chatId, message, args) {
    const { getSender } = require('../lib/getSender');
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || getSender(sock, message);
    const num    = target.split('@')[0];
    let status = 'No status';
    try { const s = await sock.fetchStatus(target); if (s?.status) status = s.status; } catch {}
    let ppUrl = null;
    try { ppUrl = await sock.profilePictureUrl(target, 'image'); } catch {}
    const card = `┌──────────────────┐\n│ 👤 *ScottyMd Name Card*\n├──────────────────┤\n│ 📱 +${num}\n│ 💬 ${status.slice(0,50)}\n└──────────────────┘\n_© ScottyMd by Scotty_`;
    if (ppUrl) {
        const { getBuffer } = require('../lib/myfunc');
        try { const buf = await getBuffer(ppUrl); await sock.sendMessage(chatId, { image: buf, caption: card, mentions: [target] }, { quoted: message }); return; } catch {}
    }
    await sock.sendMessage(chatId, { text: card, mentions: [target] }, { quoted: message });
}
module.exports = namecardCommand;
