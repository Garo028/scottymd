/** ScottyMd — .howold age calculator © ScottyMd by Scotty */
async function howoldCommand(sock, chatId, message, args) {
    const input = args.join(' ').trim();
    if (!input) return await sock.sendMessage(chatId, { text: '❌ Usage: .howold DD/MM/YYYY\nExample: .howold 15/06/1995' }, { quoted: message });
    const parts = input.split(/[\/\-\.]/);
    if (parts.length < 3) return await sock.sendMessage(chatId, { text: '❌ Format: DD/MM/YYYY' }, { quoted: message });
    const bday  = new Date(+parts[2], +parts[1]-1, +parts[0]);
    const now   = new Date();
    const diff  = now - bday;
    const years = Math.floor(diff / (365.25*24*3600*1000));
    const months= Math.floor((diff % (365.25*24*3600*1000)) / (30.44*24*3600*1000));
    const days  = Math.floor((diff % (30.44*24*3600*1000)) / (24*3600*1000));
    if (years < 0 || years > 150) return await sock.sendMessage(chatId, { text: '❌ Invalid date.' }, { quoted: message });
    await sock.sendMessage(chatId, { text: `🎂 *Age Calculator*\n\n📅 Birth date: ${input}\n\n🎉 Age: *${years} years, ${months} months, ${days} days*\n\n_© ScottyMd_` }, { quoted: message });
}
module.exports = howoldCommand;
