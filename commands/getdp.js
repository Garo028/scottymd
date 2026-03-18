/**
 * ScottyMd — .getdp command
 * Fetches and sends a user's WhatsApp profile picture
 * © @Scottymd
 */
const { getBuffer } = require('../lib/myfunc');

async function getDpCommand(sock, chatId, message) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quotedParticipant = message.message?.extendedTextMessage?.contextInfo?.participant;
        if (quotedParticipant && !mentioned.includes(quotedParticipant)) mentioned.push(quotedParticipant);

        // Default to self if no mention
        let targetJid;
        if (mentioned.length > 0) {
            targetJid = mentioned[0];
        } else {
            targetJid = message.key.fromMe
                ? sock.user.id.split(':')[0] + '@s.whatsapp.net'
                : (getSender(sock, message));
        }

        const number = targetJid.split('@')[0];
        await sock.sendMessage(chatId, { text: `🖼️ Fetching profile picture of @${number}...`, mentions: [targetJid] }, { quoted: message });

        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(targetJid, 'image');
        } catch {
            return await sock.sendMessage(chatId, {
                text: `❌ @${number} has no profile picture or it is private.`,
                mentions: [targetJid]
            }, { quoted: message });
        }

        const buffer = await getBuffer(ppUrl);

        await sock.sendMessage(chatId, {
            image: buffer,
            caption: `🖼️ *Profile Picture*\n📱 Number: +${number}\n\n_© @Scottymd_`,
            mentions: [targetJid]
        }, { quoted: message });

    } catch (e) {
        console.error('GetDP error:', e.message);
        await sock.sendMessage(chatId, {
            text: '❌ Could not fetch profile picture.'
        }, { quoted: message });
    }
}

module.exports = getDpCommand;
