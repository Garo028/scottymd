/**
 * ScottyMd — .help / .menu command
 * © ScottyMd by Scotty
 */
const settings = require('../settings');

async function helpCommand(sock, chatId, message) {
    const menu = `
╔════════════════════════╗
║  🤖 *SCOTTYMD BOT*
║  _v${settings.version} | © Scotty_
╚════════════════════════╝

┌─────⟪ CORE ⟫─────
│✦ .menu .ping .alive .uptime
│✦ .owner .deviceinfo
│✦ .pair <number>
│✦ .session
│✦ .mode public/private
│✦ .alwaysonline on/off
└──────────────────

┌─────⟪ INFO & TOOLS ⟫─────
│✦ .weather <city>
│✦ .news <topic>
│✦ .wiki <topic>
│✦ .define <word>
│✦ .country <n>
│✦ .github <user>
│✦ .currency <amt> <f> <t>
│✦ .calc <expr>
│✦ .qr <text/url>
│✦ .tr <lang> <text>
│✦ .tts <text>
│✦ .remind <time> <msg>
│✦ .short <url>
│✦ .countdown <date>
│✦ .wc <text>
│✦ .howold <dd/mm/yyyy>
│✦ .password <length>
└──────────────────

┌─────⟪ MEDIA ⟫─────
│✦ .sticker / .s
│✦ .steal — steal sticker
│✦ .toimg — sticker→image
│✦ .play <song>
│✦ .lyrics <song>
│✦ .spotify <song>
│✦ .vv — reveal view once
│✦ .getdp @user
│✦ .savestatus
│✦ .caption <text>
│✦ .emojimix 😂🔥
│✦ .imagine <prompt>
│✦ .nowplaying <song>
└──────────────────

┌─────⟪ FUN & GAMES ⟫─────
│✦ .joke .quote .fact .funfact
│✦ .8ball <q> .trivia .mathquiz
│✦ .truth .dare
│✦ .hangman .guess <letter>
│✦ .tictactoe @user
│✦ .poll Q|opt1|opt2
│✦ .quickpoll <q>
│✦ .coinflip .dice .rps
│✦ .roast .ship .compliment
│✦ .insult .love .mock
│✦ .reverse .ascii bold/italic
│✦ .mugshot .namecard @user
│✦ .pokemon <n>
│✦ .confess <text>
│✦ .readmore <text>
│✦ .randomname
│✦ .shrug .flip .lenny .bear
│✦ .getquote <category>
└──────────────────

┌─────⟪ ECONOMY & XP ⟫─────
│✦ .balance @user
│✦ .daily — collect reward
│✦ .pay @user <amount>
│✦ .rich — richest members
│✦ .level / .rank @user
│✦ .leaderboard
└──────────────────

┌─────⟪ NOTES ⟫─────
│✦ .note <n> <content>
│✦ .getnote <n>
│✦ .delnote <n>
│✦ .notes — list all
└──────────────────

┌─────⟪ GROUP ADMIN ⟫─────
│✦ .kick .promote .demote
│✦ .mute .unmute
│✦ .warn .warnings .clearwarn
│✦ .del .tagall .hidetag
│✦ .welcome on/off/set
│✦ .goodbye on/off/set
│✦ .antilink on/off/mode
│✦ .antibadword on/off/add
│✦ .antispam on/off/limit
│✦ .antiflood on/off
│✦ .antiraid on/off
│✦ .filter add/del/list
│✦ .chatbot on/off
│✦ .afk <reason>
│✦ .report @user <reason>
│✦ .topmembers
│✦ .groupinfo .admins
│✦ .getlink .resetlink
│✦ .setname .setdesc .setgpp
│✦ .schedule <time> <msg>
└──────────────────

┌─────⟪ OWNER CONTROL ⟫─────
│✦ .mode public/private
│✦ .ban .unban @user
│✦ .bc <message>
│✦ .bcgroups <message>
│✦ .autoreply on/off/set
│✦ .grouplist
│✦ .alwaysonline on/off
└──────────────────

┌─────⟪ AI ⟫─────
│✦ .ai / .ask <question>
│✦ .imagine <prompt>
│✦ .profile @user
└──────────────────

_Prefix: *${settings.prefix}* | Commands: 100+_
_© ScottyMd by Scotty_
`.trim();

    await sock.sendMessage(chatId, { text: menu }, { quoted: message });
}

module.exports = helpCommand;
