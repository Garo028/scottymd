/** ScottyMd — .getquote get quote by category © ScottyMd by Scotty */
const axios = require('axios');
const CATS = ['life','love','happiness','success','wisdom','funny','friendship'];
async function getQuoteCommand(sock, chatId, message, args) {
    try {
        const cat = args[0]?.toLowerCase();
        const tag = CATS.includes(cat) ? cat : CATS[Math.floor(Math.random()*CATS.length)];
        const res = await axios.get(`https://api.quotable.io/random?tags=${tag}`, { timeout: 8000 });
        const q = res.data;
        await sock.sendMessage(chatId, { text: `💬 *${tag.charAt(0).toUpperCase()+tag.slice(1)} Quote*\n\n_"${q.content}"_\n\n— *${q.author}*\n\n_© ScottyMd_` }, { quoted: message });
    } catch { await sock.sendMessage(chatId, { text: '❌ Could not fetch quote. Try again.' }, { quoted: message }); }
}
module.exports = getQuoteCommand;
