/**
 * ScottyMd — .github command
 * Look up any GitHub user profile
 * © @Scottymd
 */
const axios = require('axios');

async function githubCommand(sock, chatId, message, args) {
    try {
        const username = args[0]?.trim();
        if (!username) return await sock.sendMessage(chatId, { text: '❌ Usage: .github <username>\nExample: .github torvalds' }, { quoted: message });

        const res  = await axios.get(`https://api.github.com/users/${username}`, { timeout: 10000 });
        const user = res.data;

        const text = `
🐙 *GitHub Profile*
━━━━━━━━━━━━━━
👤 *Name:* ${user.name || 'N/A'}
🔖 *Username:* @${user.login}
📝 *Bio:* ${user.bio || 'No bio'}
🏢 *Company:* ${user.company || 'N/A'}
📍 *Location:* ${user.location || 'N/A'}
🔗 *Profile:* ${user.html_url}

📊 *Stats:*
• ⭐ Public Repos: ${user.public_repos}
• 👥 Followers: ${user.followers}
• 👣 Following: ${user.following}
• 📦 Gists: ${user.public_gists}

📅 *Joined:* ${new Date(user.created_at).toDateString()}
━━━━━━━━━━━━━━
_© @Scottymd_`.trim();

        await sock.sendMessage(chatId, { text }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ GitHub user not found.' }, { quoted: message });
    }
}
module.exports = githubCommand;
