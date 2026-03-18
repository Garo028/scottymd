/**
 * ScottyMd v2.0 — Main Entry Point
 * Web Pair + Bot combined
 * Works on Railway, Render, Koyeb, VPS
 * © ScottyMd by Scotty
 */

require('dotenv').config();

const fs        = require('fs');
const path      = require('path');
const chalk     = require('chalk');
const NodeCache = require('node-cache');
const pino      = require('pino');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    jidDecode,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys');

const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const store    = require('./lib/lightweight_store');
const settings = require('./settings');

// ── Folders ───────────────────────────────────────────────────────────────────
['session','temp','data','sessions','public'].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ── Temp redirect ─────────────────────────────────────────────────────────────
const tempDir = path.join(process.cwd(), 'temp');
process.env.TMPDIR = tempDir;
process.env.TEMP   = tempDir;
process.env.TMP    = tempDir;
setInterval(() => {
    fs.readdir(tempDir, (err, files) => {
        if (err) return;
        files.forEach(f => {
            const fp = path.join(tempDir, f);
            fs.stat(fp, (e, s) => {
                if (!e && Date.now() - s.mtimeMs > 3*60*60*1000) fs.unlink(fp, ()=>{});
            });
        });
    });
}, 3*60*60*1000);

// ── Store ─────────────────────────────────────────────────────────────────────
store.readFromFile();
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000);

// ── Memory management ─────────────────────────────────────────────────────────
setInterval(() => { if (global.gc) global.gc(); }, 60_000);
setInterval(() => {
    const mb = process.memoryUsage().rss / 1024 / 1024;
    if (mb > 450) { console.log('⚠️ RAM > 450MB — restarting'); process.exit(1); }
}, 30_000);

// ── Start web server ──────────────────────────────────────────────────────────
try {
    const { startServer } = require('./server');
    startServer();
} catch(e) {
    console.error('Server error:', e.message);
}

global.botname    = settings.botName;
global.themeemoji = '✦';

// ── Restore session from SESSION_ID env ───────────────────────────────────────
async function restoreSession() {
    const id = process.env.SESSION_ID;
    if (!id) return false;
    try {
        const creds = './session/creds.json';
        if (fs.existsSync(creds)) return true;
        let decoded;
        try { decoded = Buffer.from(id, 'base64').toString('utf8'); JSON.parse(decoded); }
        catch { decoded = id; }
        fs.mkdirSync('./session', { recursive: true });
        fs.writeFileSync(creds, decoded);
        console.log(chalk.green('✅ Session restored from SESSION_ID'));
        return true;
    } catch(e) {
        console.log(chalk.yellow('⚠️ Session restore failed:', e.message));
        return false;
    }
}

// ── Get phone number ──────────────────────────────────────────────────────────
async function getPhone() {
    let num = (process.env.OWNER_NUMBER || process.env.BOT_NUMBER || settings.ownerNumber || '')
        .toString().replace(/[^0-9]/g, '');
    if (num && num.length >= 7) return num;
    try {
        const readline = require('readline');
        if (process.stdin.isTTY) {
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            num = await new Promise(r => rl.question(chalk.greenBright('\n📱 Enter your WhatsApp number: '), a => { rl.close(); r(a.replace(/[^0-9]/g,'')); }));
        }
    } catch {}
    return num;
}

// ── Start bot ─────────────────────────────────────────────────────────────────
async function startBot() {
    try {
        await restoreSession();

        const { version }          = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        const retryCache           = new NodeCache();

        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ['Ubuntu','Chrome','20.0.04'],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level:'fatal' }).child({ level:'fatal' }))
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                const msg = await store.loadMessage(jidNormalizedUser(key.remoteJid), key.id);
                return msg?.message || '';
            },
            msgRetryCounterCache: retryCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs:      60000,
            keepAliveIntervalMs:   10000,
        });

        global.scottyMdSock = sock;
        sock.ev.on('creds.update', saveCreds);
        store.bind(sock.ev);

        sock.decodeJid = (jid) => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                const d = jidDecode(jid) || {};
                return d.user && d.server ? `${d.user}@${d.server}` : jid;
            }
            return jid;
        };

        try {
            const { getMode } = require('./commands/mode');
            sock.public = getMode().mode !== 'private';
        } catch { sock.public = true; }

        sock.ev.on('contacts.update', updates => {
            for (const c of updates) {
                const id = sock.decodeJid(c.id);
                if (store?.contacts) store.contacts[id] = { id, name: c.notify };
            }
        });

        // ── Pairing code ──────────────────────────────────────────────────────
        if (!sock.authState.creds.registered) {
            const num = await getPhone();
            if (!num || num.length < 7) {
                console.log(chalk.red('\n❌ No phone number!'));
                console.log(chalk.yellow('Set OWNER_NUMBER in your environment variables\n'));
                return; // Keep server running for web pair
            }

            console.log(chalk.yellow(`\n📱 Requesting pairing code for +${num}...`));
            await delay(3000);

            try {
                let code = await sock.requestPairingCode(num);
                code = code?.match(/.{1,4}/g)?.join('-') || code;

                console.log('\n');
                console.log(chalk.bgGreen.black('  ╔══════════════════════════════════════╗  '));
                console.log(chalk.bgGreen.black('  ║       🔐  SCOTTYMD PAIRING CODE      ║  '));
                console.log(chalk.bgGreen.black('  ╠══════════════════════════════════════╣  '));
                console.log(chalk.bgGreen.black(`  ║            ${chalk.bold(code)}              ║  `));
                console.log(chalk.bgGreen.black('  ╠══════════════════════════════════════╣  '));
                console.log(chalk.bgGreen.black('  ║  WhatsApp → Settings → Linked Devices ║  '));
                console.log(chalk.bgGreen.black('  ║  → Link a Device → Phone number       ║  '));
                console.log(chalk.bgGreen.black('  ╚══════════════════════════════════════╝  '));
                console.log('\n');

                try { fs.writeFileSync('./data/pair_code.txt', `CODE: ${code}\nFor: +${num}\n${new Date().toISOString()}`); } catch {}

            } catch(err) {
                console.error(chalk.red('❌ Pairing error:'), err.message);
                await delay(5000);
                return startBot();
            }
        }

        // ── Messages ──────────────────────────────────────────────────────────
        sock.ev.on('messages.upsert', async (update) => {
            try {
                const mek = update.messages[0];
                if (!mek?.message) return;
                mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message : mek.message;
                if (mek.key?.remoteJid === 'status@broadcast') { await handleStatus(sock, update); return; }
                if (!sock.public && !mek.key.fromMe && update.type === 'notify') {
                    if (!mek.key?.remoteJid?.endsWith('@g.us')) return;
                }
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
                if (sock?.msgRetryCounterCache) sock.msgRetryCounterCache.clear();
                await handleMessages(sock, update);
            } catch(e) { console.error('msg error:', e.message); }
        });

        // ── Anti-call ─────────────────────────────────────────────────────────
        sock.ev.on('call', async (calls) => {
            for (const call of calls) {
                const jid = call.from || call.peerJid || call.chatId;
                if (!jid) continue;
                try { if (typeof sock.rejectCall === 'function' && call.id) await sock.rejectCall(call.id, jid); } catch {}
            }
        });

        // ── Group events ──────────────────────────────────────────────────────
        sock.ev.on('group-participants.update', async (u) => {
            await handleGroupParticipantUpdate(sock, u);
        });

        // ── Connection ────────────────────────────────────────────────────────
        sock.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect } = s;
            if (connection === 'connecting') console.log(chalk.yellow('🔄 Connecting...'));

            if (connection === 'open') {
                await delay(1500);

                // Init always online
                try { const { initAlwaysOnline } = require('./commands/alwaysonline'); initAlwaysOnline(sock); } catch {}

                // Auto join
                try { const { autoJoinScotty } = require('./lib/autojoin'); await autoJoinScotty(sock); } catch {}

                // Save session backup
                try {
                    const creds = './session/creds.json';
                    if (fs.existsSync(creds)) {
                        fs.writeFileSync('./data/session_backup.b64', Buffer.from(fs.readFileSync(creds,'utf8')).toString('base64'));
                    }
                } catch {}

                // Clean pair code
                try { if (fs.existsSync('./data/pair_code.txt')) fs.unlinkSync('./data/pair_code.txt'); } catch {}

                // Notify bot number
                try {
                    const botNum = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                    await sock.sendMessage(botNum, {
                        text: `✅ *${settings.botName} v${settings.version}* is online!\n\n🌐 Mode: ${sock.public?'Public':'Private'}\n\nSend *.help* to see all commands\nSend *.session* to get SESSION_ID\n\n_© ScottyMd by Scotty_`
                    });
                } catch {}

                console.log(chalk.cyan('\n╔══════════════════════════════════╗'));
                console.log(chalk.cyan(`║  🤖  ${chalk.bold.yellow(settings.botName + ' v' + settings.version)}  ✅`));
                console.log(chalk.cyan(`║  👤  Owner: +${settings.ownerNumber}`));
                console.log(chalk.cyan(`║  🌐  Mode: ${sock.public?'Public':'Private'}`));
                console.log(chalk.cyan('╚══════════════════════════════════╝\n'));
                console.log(chalk.green('✅ Ready! Send .help in WhatsApp\n'));
            }

            if (connection === 'close') {
                const code      = lastDisconnect?.error?.output?.statusCode;
                const reconnect = code !== DisconnectReason.loggedOut && code !== 401;
                console.log(chalk.red(`⛔ Disconnected. Code: ${code}`));
                if (code === DisconnectReason.loggedOut || code === 401) {
                    try { fs.rmSync('./session', { recursive: true, force: true }); } catch {}
                    process.exit(1);
                }
                if (reconnect) { console.log(chalk.yellow('♻️ Reconnecting in 5s...')); await delay(5000); startBot(); }
            }
        });

        return sock;
    } catch(e) {
        console.error('❌ Bot crash:', e.message);
        await delay(5000);
        startBot();
    }
}

startBot().catch(e => { console.error('Fatal:', e); process.exit(1); });
process.on('uncaughtException',  e => console.error('Uncaught:', e.message));
process.on('unhandledRejection', e => console.error('Rejection:', e));

const file = require.resolve(__filename);
fs.watchFile(file, () => { fs.unwatchFile(file); delete require.cache[file]; require(file); });
