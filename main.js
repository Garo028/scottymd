/**
 * ScottyMd — Main Message Handler (FULL REBUILD)
 * All permissions fixed. All 100+ commands wired.
 * © ScottyMd by Scotty
 */
'use strict';
const fs   = require('fs');
const path = require('path');

// ── Temp redirect ─────────────────────────────────────────────────────────────
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp; process.env.TEMP = customTemp; process.env.TMP = customTemp;
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const f of files) { const fp = path.join(customTemp, f); fs.stat(fp, (e,s) => { if (!e && Date.now()-s.mtimeMs > 3*3600000) fs.unlink(fp,()=>{}); }); }
    });
}, 3*3600000);

const settings      = require('./settings');
require('./config.js');
const { isBanned }  = require('./lib/isBanned');
const isOwnerOrSudo = require('./lib/isOwner');
const { getSender } = require('./lib/getSender');

// ── Imports ───────────────────────────────────────────────────────────────────
// Core
const helpCommand       = require('./commands/help');
const pingCommand       = require('./commands/ping');
const aliveCommand      = require('./commands/alive');
const ownerCommand      = require('./commands/owner');
const uptimeCommand     = require('./commands/uptime');
const deviceInfoCommand = require('./commands/deviceinfo');
const { modeCommand }   = require('./commands/mode');
const pairCommand       = require('./commands/pair');
const sessionCommand    = require('./commands/sessioninfo');

// Info & Tools
const weatherCommand    = require('./commands/weather');
const newsCommand       = require('./commands/news');
const wikiCommand       = require('./commands/wikipedia');
const defineCommand     = require('./commands/dictionary');
const countryCommand    = require('./commands/country');
const githubCommand     = require('./commands/github');
const currencyCommand   = require('./commands/currency');
const calcCommand       = require('./commands/calculator');
const qrCommand         = require('./commands/qrcode');
const { translateCommand } = require('./commands/translate');
const ttsCommand        = require('./commands/tts');
const remindCommand     = require('./commands/remind');
const shortUrlCommand   = require('./commands/tinyurl');
const countdownCommand  = require('./commands/countdown');
const wordcountCommand  = require('./commands/wordcount');
const howoldCommand     = require('./commands/howold');
const passwordCommand   = require('./commands/password');

// Media
const stickerCommand    = require('./commands/sticker');
const playCommand       = require('./commands/play');
const lyricsCommand     = require('./commands/lyrics');
const viewOnceCommand   = require('./commands/viewonce');
const getDpCommand      = require('./commands/getdp');
const saveStatusCommand = require('./commands/savestatus');
const captionCommand    = require('./commands/caption');
const emojiMixCommand   = require('./commands/emojimix');
const stealCommand      = require('./commands/steal');
const stickerToMediaCmd = require('./commands/stickertomedia');
const imagineCommand    = require('./commands/closedai');
const spotifyCommand    = require('./commands/spotify');
const nowPlayingCommand = require('./commands/lyrics2');

// Fun & Games
const jokeCommand       = require('./commands/joke');
const quoteCommand      = require('./commands/quote');
const factCommand       = require('./commands/fact');
const eightBallCmd      = require('./commands/eightball');
const { truthCommand, dareCommand } = require('./commands/truth');
const roastCommand      = require('./commands/roast');
const shipCommand       = require('./commands/ship');
const complimentCommand = require('./commands/compliment');
const insultCommand     = require('./commands/insult');
const tictactoeCommand  = require('./commands/tictactoe');
const pollCommand       = require('./commands/poll');
const quickPollCommand  = require('./commands/poll2');
const { coinflipCommand, diceCommand, rpsCommand } = require('./commands/coinflip');
const { mathCommand, checkMathAnswer }             = require('./commands/math');
const { triviaCommand, checkTriviaAnswer }         = require('./commands/trivia');
const { hangmanCommand, hangmanGuess }             = require('./commands/hangman');
const loveCommand       = require('./commands/love');
const mockCommand       = require('./commands/mocktext');
const reverseCommand    = require('./commands/reverse');
const asciiCommand      = require('./commands/ascii');
const randomnameCommand = require('./commands/randomname');
const mugshotCommand    = require('./commands/mugshot');
const getQuoteCommand   = require('./commands/getquote');
const funfactCommand    = require('./commands/funfact');
const confessCommand    = require('./commands/confession');
const artCommand        = require('./commands/shrug');
const pokemonCommand    = require('./commands/pokedex');
const namecardCommand   = require('./commands/namecard');
const readmoreCommand   = require('./commands/readmore');

// Economy & Leveling
const { balanceCommand, dailyCommand, payCommand, richCommand } = require('./commands/economy');
const { levelCommand, addXp } = require('./commands/leveling');
const leaderboardCommand = require('./commands/leaderboard');

// Notes
const { noteCommand, getNoteCommand, delNoteCommand, notesListCommand } = require('./commands/notes');

// AFK
const { afkCommand, handleAfkMention } = require('./commands/afk');

// Group Admin
const kickCommand       = require('./commands/kick');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand }  = require('./commands/demote');
const { muteCommand, unmuteCommand } = require('./commands/mute');
const warnCommand       = require('./commands/warn');
const warningsCommand   = require('./commands/warnings');
const clearWarnCmd      = require('./commands/clearwarn');
const tagAllCommand     = require('./commands/tagall');
const hideTagCommand    = require('./commands/hidetag');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const { antilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { antibadwordCommand, handleBadwordDetection } = require('./commands/antibadword');
const { antispamCommand, handleSpamDetection } = require('./commands/antispam');
const { antifloodCommand, handleFloodDetection } = require('./commands/antiflood');
const { antiraidCommand, handleRaidDetection } = require('./commands/antiraid');
const { filterCommand, handleFilterResponse } = require('./commands/filter');
const { chatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const { topMembersCommand, incrementCount } = require('./commands/topmembers');
const groupInfoCommand  = require('./commands/groupinfo');
const staffCommand      = require('./commands/staff');
const getLinkCommand    = require('./commands/getlink');
const resetLinkCmd      = require('./commands/resetlink');
const { setGroupNameCommand, setGroupDescCommand, setGroupPhotoCommand } = require('./commands/setgroup');
const deleteCommand     = require('./commands/delete');
const reportCommand     = require('./commands/report');
const scheduleCommand   = require('./commands/schedule');
const broadcastGroupsCommand = require('./commands/broadcast2');

// Owner
const { banCommand, unbanCommand } = require('./commands/ban');
const { bcCommand, addConnectedUser } = require('./commands/bc');
const { autoReplyCommand, handleAutoReply } = require('./commands/autoreply');
const groupListCommand  = require('./commands/grouplist');
const { alwaysonlineCommand, initAlwaysOnline } = require('./commands/alwaysonline');
const aiCommand         = require('./commands/ai');
const profileCommand    = require('./commands/profile');

// ── Globals ───────────────────────────────────────────────────────────────────
global.packname = settings.packname;
global.author   = settings.author;

// ── Main handler ──────────────────────────────────────────────────────────────
async function handleMessages(sock, messageUpdate) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;
        const message = messages[0];
        if (!message?.message) return;

        if (Object.keys(message.message)[0] === 'ephemeralMessage') {
            message.message = message.message.ephemeralMessage.message;
        }

        const chatId   = message.key.remoteJid;
        const isGroup  = chatId?.endsWith('@g.us');
        const senderId = getSender(sock, message);

        if (!chatId || !senderId) return;
        if (chatId === 'status@broadcast') return;
        if (isBanned(senderId)) return;

        const rawText =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            message.message?.buttonsResponseMessage?.selectedButtonId ||
            message.message?.listResponseMessage?.singleSelectReply?.selectedRowId || '';

        const prefix      = settings.prefix || '.';
        const userMessage = rawText.trim().toLowerCase();

        // Track for .bc
        if (!isGroup) addConnectedUser(senderId);

        // Add XP for every message in group
        if (isGroup) {
            addXp(chatId, senderId, 3);
            incrementCount(chatId, senderId);
        }

        // Auto-reply DMs
        if (!isGroup && !message.key.fromMe) {
            await handleAutoReply(sock, message);
        }

        // Group detectors (non-command messages)
        if (isGroup && rawText) {
            await handleLinkDetection(sock, chatId, message);
            await handleBadwordDetection(sock, chatId, message);
            await handleSpamDetection(sock, chatId, senderId, message);
            await handleFloodDetection(sock, chatId, senderId, rawText);
            await handleAfkMention(sock, chatId, message, senderId);
            await handleFilterResponse(sock, chatId, rawText);
        }

        if (!userMessage.startsWith(prefix)) {
            // Non-command checks
            if (isGroup) await handleChatbotResponse(sock, chatId, message, rawText);
            // Check trivia/math answers
            await checkMathAnswer(sock, chatId, message, rawText.trim());
            await checkTriviaAnswer(sock, chatId, message, rawText.trim());
            return;
        }

        const [cmd] = userMessage.slice(prefix.length).split(/\s+/);
        const args  = rawText.trim().slice(prefix.length).split(/\s+/).slice(1);

        switch (cmd) {

            // ── Core ──────────────────────────────────────────────────────────
            case 'help': case 'menu':
                await helpCommand(sock, chatId, message); break;
            case 'ping':
                await pingCommand(sock, chatId, message); break;
            case 'alive':
                await aliveCommand(sock, chatId, message); break;
            case 'owner':
                await ownerCommand(sock, chatId, message); break;
            case 'uptime':
                await uptimeCommand(sock, chatId, message); break;
            case 'deviceinfo': case 'sysinfo': case 'botinfo':
                await deviceInfoCommand(sock, chatId, message); break;
            case 'mode':
                await modeCommand(sock, chatId, message, args); break;
            case 'pair':
                await pairCommand(sock, chatId, message, args); break;
            case 'session': case 'sessioninfo':
                await sessionCommand(sock, chatId, message); break;

            // ── Info & Tools ──────────────────────────────────────────────────
            case 'weather':
                await weatherCommand(sock, chatId, message, args); break;
            case 'news':
                await newsCommand(sock, chatId, message, args); break;
            case 'wiki': case 'wikipedia': case 'search':
                await wikiCommand(sock, chatId, message, args); break;
            case 'define': case 'dictionary': case 'dict':
                await defineCommand(sock, chatId, message, args); break;
            case 'country': case 'countryinfo':
                await countryCommand(sock, chatId, message, args); break;
            case 'github': case 'gh':
                await githubCommand(sock, chatId, message, args); break;
            case 'currency': case 'convert': case 'rate':
                await currencyCommand(sock, chatId, message, args); break;
            case 'calc': case 'calculator': case 'math':
                await calcCommand(sock, chatId, message, args); break;
            case 'qr': case 'qrcode':
                await qrCommand(sock, chatId, message, args); break;
            case 'tr': case 'translate':
                await translateCommand(sock, chatId, message, args); break;
            case 'tts':
                await ttsCommand(sock, chatId, message, args); break;
            case 'remind': case 'reminder':
                await remindCommand(sock, chatId, message, args); break;
            case 'short': case 'shorten': case 'tinyurl':
                await shortUrlCommand(sock, chatId, message, args); break;
            case 'countdown':
                await countdownCommand(sock, chatId, message, args); break;
            case 'wc': case 'wordcount':
                await wordcountCommand(sock, chatId, message, args); break;
            case 'howold': case 'age':
                await howoldCommand(sock, chatId, message, args); break;
            case 'password': case 'pwd': case 'passgen':
                await passwordCommand(sock, chatId, message, args); break;

            // ── Media ─────────────────────────────────────────────────────────
            case 'sticker': case 's':
                await stickerCommand(sock, chatId, message); break;
            case 'play':
                await playCommand(sock, chatId, message, args); break;
            case 'lyrics': case 'lyric':
                await lyricsCommand(sock, chatId, message, args); break;
            case 'vv': case 'viewonce': case 'vo':
                await viewOnceCommand(sock, chatId, message); break;
            case 'getdp': case 'dp': case 'pfp':
                await getDpCommand(sock, chatId, message); break;
            case 'savestatus': case 'statusdown': case 'storydown':
                await saveStatusCommand(sock, chatId, message); break;
            case 'caption': case 'cap':
                await captionCommand(sock, chatId, message, args); break;
            case 'emojimix': case 'emix':
                await emojiMixCommand(sock, chatId, message, args); break;
            case 'steal': case 'takesticker':
                await stealCommand(sock, chatId, message, args); break;
            case 'toimg': case 'tovid': case 'sticker2img':
                await stickerToMediaCmd(sock, chatId, message); break;
            case 'imagine': case 'generate': case 'ai2img':
                await imagineCommand(sock, chatId, message, args); break;
            case 'spotify': case 'song': case 'track':
                await spotifyCommand(sock, chatId, message, args); break;
            case 'nowplaying': case 'np':
                await nowPlayingCommand(sock, chatId, message, args); break;

            // ── Fun & Games ───────────────────────────────────────────────────
            case 'joke': case 'jokes':
                await jokeCommand(sock, chatId, message, args); break;
            case 'quote':
                await quoteCommand(sock, chatId, message); break;
            case 'fact':
                await factCommand(sock, chatId, message); break;
            case 'funfact':
                await funfactCommand(sock, chatId, message, args); break;
            case '8ball':
                await eightBallCmd(sock, chatId, message, args); break;
            case 'truth':
                await truthCommand(sock, chatId, message); break;
            case 'dare':
                await dareCommand(sock, chatId, message); break;
            case 'roast':
                await roastCommand(sock, chatId, message); break;
            case 'ship':
                await shipCommand(sock, chatId, message); break;
            case 'compliment': case 'praise':
                await complimentCommand(sock, chatId, message); break;
            case 'insult': case 'burn':
                await insultCommand(sock, chatId, message); break;
            case 'tictactoe': case 'ttt':
                await tictactoeCommand(sock, chatId, message, args); break;
            case 'poll':
                await pollCommand(sock, chatId, message, args); break;
            case 'quickpoll': case 'qpoll':
                await quickPollCommand(sock, chatId, message, args); break;
            case 'coinflip': case 'flip':
                await coinflipCommand(sock, chatId, message); break;
            case 'dice': case 'roll':
                await diceCommand(sock, chatId, message, args); break;
            case 'rps':
                await rpsCommand(sock, chatId, message, args); break;
            case 'mathquiz':
                await mathCommand(sock, chatId, message); break;
            case 'trivia':
                await triviaCommand(sock, chatId, message); break;
            case 'hangman':
                await hangmanCommand(sock, chatId, message); break;
            case 'guess':
                await hangmanGuess(sock, chatId, message, args); break;
            case 'love': case 'lovecalc':
                await loveCommand(sock, chatId, message, args); break;
            case 'mock':
                await mockCommand(sock, chatId, message, args); break;
            case 'reverse':
                await reverseCommand(sock, chatId, message, args); break;
            case 'ascii': case 'fancy':
                await asciiCommand(sock, chatId, message, args); break;
            case 'randomname': case 'fakename':
                await randomnameCommand(sock, chatId, message); break;
            case 'mugshot': case 'wanted':
                await mugshotCommand(sock, chatId, message); break;
            case 'getquote': case 'catquote':
                await getQuoteCommand(sock, chatId, message, args); break;
            case 'confess': case 'confession':
                await confessCommand(sock, chatId, message, args); break;
            case 'pokemon': case 'pokedex':
                await pokemonCommand(sock, chatId, message, args); break;
            case 'namecard': case 'card':
                await namecardCommand(sock, chatId, message); break;
            case 'readmore': case 'rm':
                await readmoreCommand(sock, chatId, message, args); break;
            case 'shrug': case 'flip': case 'unflip': case 'lenny': case 'bear': case 'ninja': case 'cry': case 'heart':
                await artCommand(sock, chatId, message, cmd); break;

            // ── Economy ───────────────────────────────────────────────────────
            case 'balance': case 'bal': case 'wallet':
                await balanceCommand(sock, chatId, message); break;
            case 'daily':
                await dailyCommand(sock, chatId, message); break;
            case 'pay': case 'send':
                await payCommand(sock, chatId, message, args); break;
            case 'rich': case 'richlist':
                await richCommand(sock, chatId, message); break;
            case 'level': case 'rank': case 'xp':
                await levelCommand(sock, chatId, message); break;
            case 'leaderboard': case 'lb': case 'top':
                await leaderboardCommand(sock, chatId, message); break;

            // ── Notes ─────────────────────────────────────────────────────────
            case 'note': case 'savenote':
                await noteCommand(sock, chatId, message, args); break;
            case 'getnote': case 'note#':
                await getNoteCommand(sock, chatId, message, args); break;
            case 'delnote': case 'rmnote':
                await delNoteCommand(sock, chatId, message, args); break;
            case 'notes': case 'notelist':
                await notesListCommand(sock, chatId, message); break;

            // ── AFK ───────────────────────────────────────────────────────────
            case 'afk':
                await afkCommand(sock, chatId, message, args); break;

            // ── Group Admin ───────────────────────────────────────────────────
            case 'kick': case 'remove':
                await kickCommand(sock, chatId, message); break;
            case 'promote':
                await promoteCommand(sock, chatId, message); break;
            case 'demote':
                await demoteCommand(sock, chatId, message); break;
            case 'mute':
                await muteCommand(sock, chatId, message); break;
            case 'unmute':
                await unmuteCommand(sock, chatId, message); break;
            case 'warn':
                await warnCommand(sock, chatId, message); break;
            case 'warnings': case 'warnlist':
                await warningsCommand(sock, chatId, message); break;
            case 'clearwarn': case 'resetwarn':
                await clearWarnCmd(sock, chatId, message); break;
            case 'tagall': case 'everyone':
                await tagAllCommand(sock, chatId, message, args); break;
            case 'hidetag': case 'ht':
                await hideTagCommand(sock, chatId, message, args); break;
            case 'welcome':
                await welcomeCommand(sock, chatId, message, args); break;
            case 'goodbye': case 'bye':
                await goodbyeCommand(sock, chatId, message, args); break;
            case 'antilink':
                await antilinkCommand(sock, chatId, message, args); break;
            case 'antibadword': case 'abw':
                await antibadwordCommand(sock, chatId, message, args); break;
            case 'antispam':
                await antispamCommand(sock, chatId, message, args); break;
            case 'antiflood':
                await antifloodCommand(sock, chatId, message, args); break;
            case 'antiraid':
                await antiraidCommand(sock, chatId, message, args); break;
            case 'filter':
                await filterCommand(sock, chatId, message, args); break;
            case 'chatbot': case 'cb':
                await chatbotCommand(sock, chatId, message, args); break;
            case 'topmembers': case 'topusers': case 'ranking':
                await topMembersCommand(sock, chatId, message); break;
            case 'groupinfo': case 'ginfo':
                await groupInfoCommand(sock, chatId, message); break;
            case 'admins': case 'staff':
                await staffCommand(sock, chatId, message); break;
            case 'getlink': case 'invitelink': case 'gclink':
                await getLinkCommand(sock, chatId, message); break;
            case 'resetlink': case 'revoke':
                await resetLinkCmd(sock, chatId, message); break;
            case 'setname':
                await setGroupNameCommand(sock, chatId, message, args); break;
            case 'setdesc':
                await setGroupDescCommand(sock, chatId, message, args); break;
            case 'setgpp':
                await setGroupPhotoCommand(sock, chatId, message); break;
            case 'del': case 'delete':
                await deleteCommand(sock, chatId, message); break;
            case 'report':
                await reportCommand(sock, chatId, message, args); break;
            case 'schedule':
                await scheduleCommand(sock, chatId, message, args); break;

            // ── Owner ─────────────────────────────────────────────────────────
            case 'ban':
                await banCommand(sock, chatId, message); break;
            case 'unban':
                await unbanCommand(sock, chatId, message); break;
            case 'bc': case 'broadcast':
                await bcCommand(sock, chatId, message, args); break;
            case 'bcgroups': case 'broadcastall':
                await broadcastGroupsCommand(sock, chatId, message, args); break;
            case 'autoreply': case 'ar':
                await autoReplyCommand(sock, chatId, message, args); break;
            case 'grouplist': case 'groups': case 'gclist':
                await groupListCommand(sock, chatId, message); break;
            case 'alwaysonline': case 'ao':
                await alwaysonlineCommand(sock, chatId, message, args); break;

            // ── AI ────────────────────────────────────────────────────────────
            case 'ai': case 'ask': case 'gpt':
                await aiCommand(sock, chatId, message, args); break;
            case 'profile': case 'pp':
                await profileCommand(sock, chatId, message); break;

            default:
                break;
        }

    } catch (error) {
        console.error('❌ handleMessages error:', error.message);
    }
}

// ── Group participant events ───────────────────────────────────────────────────
async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        if (!id.endsWith('@g.us')) return;
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
            await handleRaidDetection(sock, id, participants);
        }
        if (action === 'remove') await handleLeaveEvent(sock, id, participants);
    } catch (e) { console.error('handleGroupParticipantUpdate:', e.message); }
}

async function handleStatus(sock, statusUpdate) {}

module.exports = { handleMessages, handleGroupParticipantUpdate, handleStatus, initAlwaysOnline };
