/**
 * ScottyMd — .groupinfo command
 * Displays detailed group information
 * Signature: © @Scottymd
 */

async function groupInfoCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command only works in groups.'
            }, { quoted: message });
        }

        const meta = await sock.groupMetadata(chatId);
        const admins = meta.participants.filter(p => p.admin).map(p => p.id);
        const members = meta.participants.length;
        const adminCount = admins.length;
        const memberCount = members - adminCount;
        const created = new Date(meta.creation * 1000).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const desc = meta.desc
            ? meta.desc.trim().slice(0, 200) + (meta.desc.length > 200 ? '...' : '')
            : 'No description set';

        const restricted = meta.announce ? '🔒 Admins only' : '🔓 All members';
        const locked = meta.restrict ? '🔒 Locked' : '🔓 Open';

        const text = `
╔═══════════════════╗
║  📋 *GROUP INFO*
╚═══════════════════╝

🏷️ *Name:* ${meta.subject}
🆔 *JID:* ${chatId}
📅 *Created:* ${created}
👑 *Owner:* @${(meta.owner || admins[0] || 'unknown').split('@')[0]}

👥 *Members:* ${members}
⭐ *Admins:* ${adminCount}
👤 *Regular:* ${memberCount}

💬 *Messaging:* ${restricted}
🔐 *Settings:* ${locked}

📝 *Description:*
${desc}

_© @Scottymd_
`.trim();

        await sock.sendMessage(chatId, {
            text,
            mentions: meta.owner ? [meta.owner] : admins.slice(0, 1)
        }, { quoted: message });

    } catch (e) {
        console.error('GroupInfo error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch group info.' }, { quoted: message });
    }
}

module.exports = groupInfoCommand;
