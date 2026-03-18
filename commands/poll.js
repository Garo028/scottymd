/**
 * ScottyMd — .poll command
 * Create a simple poll in group
 * © @Scottymd
 */
async function pollCommand(sock, chatId, message, args) {
    try {
        // Usage: .poll Question | Option1 | Option2 | Option3
        const input = args.join(' ');
        const parts = input.split('|').map(s => s.trim()).filter(Boolean);

        if (parts.length < 3) {
            return await sock.sendMessage(chatId, {
                text: `❌ Usage: .poll <question> | <option1> | <option2> | ...\n\n*Example:*\n.poll Best fruit? | Apple | Mango | Banana`
            }, { quoted: message });
        }

        if (parts.length > 13) {
            return await sock.sendMessage(chatId, { text: '❌ Maximum 12 options allowed.' }, { quoted: message });
        }

        const question = parts[0];
        const options  = parts.slice(1).slice(0, 12);

        await sock.sendMessage(chatId, {
            poll: {
                name: question,
                values: options,
                selectableCount: 1
            }
        });

    } catch (e) {
        console.error('Poll error:', e.message);
        // Fallback: text-based poll
        try {
            const input = args.join(' ');
            const parts = input.split('|').map(s => s.trim()).filter(Boolean);
            if (parts.length < 2) return;
            const nums = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','1️⃣1️⃣','1️⃣2️⃣'];
            let text = `📊 *Poll: ${parts[0]}*\n\n`;
            parts.slice(1).forEach((opt, i) => { text += `${nums[i]} ${opt}\n`; });
            text += `\n_React with the number to vote!_\n_© @Scottymd_`;
            await sock.sendMessage(chatId, { text }, { quoted: message });
        } catch {}
    }
}
module.exports = pollCommand;
