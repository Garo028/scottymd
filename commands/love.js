/** ScottyMd — .love calculator © ScottyMd by Scotty */
async function loveCommand(sock, chatId, message, args) {
    const name1 = args[0] || 'You';
    const name2 = args[1] || 'Someone';
    const combined = (name1+name2).toLowerCase();
    let hash = 0;
    for (let i=0; i<combined.length; i++) { hash = ((hash<<5)-hash)+combined.charCodeAt(i); hash|=0; }
    const pct = Math.abs(hash) % 101;
    const bar = '❤️'.repeat(Math.round(pct/10)) + '🖤'.repeat(10-Math.round(pct/10));
    const msg = pct>=80?'Perfect match! 💞':pct>=60?'Pretty good! 💕':pct>=40?'Could work! 💛':'Needs work... 💔';
    await sock.sendMessage(chatId, { text: `💘 *Love Calculator*\n\n💑 ${name1} + ${name2}\n\n${bar}\n\n❤️ *${pct}% match*\n${msg}\n\n_© ScottyMd_` }, { quoted: message });
}
module.exports = loveCommand;
