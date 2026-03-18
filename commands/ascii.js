/** ScottyMd — .ascii fancy text command © ScottyMd by Scotty */
const STYLES = {
    bold: { a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇' },
    italic: { a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻' },
};
async function asciiCommand(sock, chatId, message, args) {
    const style = args[0]?.toLowerCase();
    const text  = args.slice(1).join(' ').toLowerCase();
    if (!STYLES[style] || !text) return await sock.sendMessage(chatId, { text: '❌ Usage: .ascii bold <text>\nStyles: bold, italic\nExample: .ascii bold Hello World' }, { quoted: message });
    const map = STYLES[style];
    const result = text.split('').map(c => map[c] || c).join('');
    await sock.sendMessage(chatId, { text: result + '\n\n_© ScottyMd_' }, { quoted: message });
}
module.exports = asciiCommand;
