/**
 * ScottyMd — .time command
 * Get current time in any timezone
 * © @Scottymd
 */
async function timeCommand(sock, chatId, message, args) {
    try {
        const timezone = args.join('_').trim() || 'Africa/Harare';
        const now      = new Date();
        let timeStr;
        try {
            timeStr = now.toLocaleString('en-US', {
                timeZone: timezone,
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            });
        } catch {
            return await sock.sendMessage(chatId, {
                text: `❌ Invalid timezone.\n\nExamples:\n.time Africa/Harare\n.time America/New_York\n.time Europe/London\n.time Asia/Tokyo`
            }, { quoted: message });
        }
        await sock.sendMessage(chatId, {
            text: `🕐 *Time — ${timezone.replace('_', ' ')}*\n\n${timeStr}\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Time lookup failed.' }, { quoted: message });
    }
}
module.exports = timeCommand;
