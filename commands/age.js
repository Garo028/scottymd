/**
 * ScottyMd — .age command
 * Calculate age from birthdate
 * © @Scottymd
 */
async function ageCommand(sock, chatId, message, args) {
    try {
        const input = args.join(' ').trim();
        if (!input) return await sock.sendMessage(chatId, { text: '❌ Usage: .age <DD/MM/YYYY>\nExample: .age 15/03/2000' }, { quoted: message });
        const parts = input.split(/[\/\-\.]/);
        if (parts.length !== 3) return await sock.sendMessage(chatId, { text: '❌ Format: DD/MM/YYYY' }, { quoted: message });
        const [day, month, year] = parts.map(Number);
        const birth = new Date(year, month - 1, day);
        const now   = new Date();
        if (isNaN(birth.getTime())) return await sock.sendMessage(chatId, { text: '❌ Invalid date.' }, { quoted: message });
        if (birth > now) return await sock.sendMessage(chatId, { text: '❌ Birth date cannot be in the future.' }, { quoted: message });

        let years  = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days   = now.getDate() - birth.getDate();

        if (days < 0) { months--; days += 30; }
        if (months < 0) { years--; months += 12; }

        const next     = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
        if (next < now) next.setFullYear(next.getFullYear() + 1);
        const daysLeft = Math.ceil((next - now) / (1000 * 60 * 60 * 24));

        await sock.sendMessage(chatId, {
            text: `🎂 *Age Calculator*\n\n📅 Birthday: ${day}/${month}/${year}\n\n🎉 Age: *${years} years, ${months} months, ${days} days*\n\n⏳ Next birthday in: *${daysLeft} days*\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Age calculation failed.' }, { quoted: message });
    }
}
module.exports = ageCommand;
