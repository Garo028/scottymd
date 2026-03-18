/**
 * ScottyMd — .tagall command
 * Tags all members in a group — open to everyone
 * Signature: © @Scottymd
 */

async function tagAllCommand(sock, chatId, message, args) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in a group.'
            }, { quoted: message });
        }
        // No admin check — anyone in the group can tagall

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants;
        const customMsg = args.join(' ') || '📢 Attention everyone!';

        let text = `*${customMsg}*\n\n`;
        const mentions = [];

        for (const participant of participants) {
            text += `@${participant.id.split('@')[0]}\n`;
            mentions.push(participant.id);
        }

        await sock.sendMessage(chatId, {
            text,
            mentions
        }, { quoted: message });

    } catch (e) {
        console.error('Tagall error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to tag all members.' }, { quoted: message });
    }
}

module.exports = tagAllCommand;
