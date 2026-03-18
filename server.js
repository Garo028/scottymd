/**
 * ScottyMd — Professional Web Pairing Server
 * Clean, fast, works on Railway / Render / Koyeb / VPS
 * © ScottyMd by Scotty
 */

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const fs        = require('fs');
const chalk     = require('chalk');
const pino      = require('pino');
const NodeCache = require('node-cache');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    delay
} = require('@whiskeysockets/baileys');

const app      = express();
const PORT     = process.env.PORT || 3000;
const APP_URL  = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.APP_URL || process.env.RENDER_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Active session tracker
const activeSessions = new Map();

// ── Keep alive ────────────────────────────────────────────────────────────────
function startKeepAlive() {
    setInterval(async () => {
        try {
            const fetch = require('node-fetch');
            await fetch(`${APP_URL}/ping`);
            console.log(chalk.cyan(`🏓 Keep-alive → ${APP_URL}`));
        } catch {}
    }, 10 * 60 * 1000);
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/ping', (req, res) => {
    res.json({ status: 'alive', bot: 'ScottyMd', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Pairing endpoint ──────────────────────────────────────────────────────────
app.post('/pair', async (req, res) => {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required.' });

    phone = phone.replace(/[^0-9]/g, '');
    if (phone.length < 7 || phone.length > 15) {
        return res.status(400).json({ error: 'Invalid number. Use full international format without + (e.g. 263788114185)' });
    }

    if (activeSessions.has(phone)) {
        return res.status(429).json({ error: 'Pairing already in progress for this number. Please wait 60 seconds.' });
    }

    activeSessions.set(phone, true);

    // Auto-cleanup after 2 minutes
    setTimeout(() => activeSessions.delete(phone), 120000);

    try {
        const sessionDir = `./sessions/${phone}`;
        if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

        const { version }          = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const cache                = new NodeCache();

        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ['Ubuntu', 'Chrome', '20.0.04'],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    pino({ level: 'fatal' }).child({ level: 'fatal' })
                )
            },
            msgRetryCounterCache: cache,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
        });

        sock.ev.on('creds.update', saveCreds);

        await delay(2000);

        let code;
        try {
            code = await sock.requestPairingCode(phone);
            code = code?.match(/.{1,4}/g)?.join('-') || code;
        } catch (err) {
            activeSessions.delete(phone);
            try { sock.end(); } catch {}
            return res.status(500).json({
                error: 'Could not generate pairing code. Make sure the number is registered on WhatsApp.'
            });
        }

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'open') {
                console.log(chalk.green(`✅ Paired: +${phone}`));
                activeSessions.delete(phone);
                try {
                    fs.writeFileSync(`${sessionDir}/info.json`, JSON.stringify({
                        phone, pairedAt: new Date().toISOString()
                    }, null, 2));
                } catch {}
                await delay(3000);
                try { sock.end(); } catch {}
            }
            if (connection === 'close') {
                activeSessions.delete(phone);
                const code = lastDisconnect?.error?.output?.statusCode;
                if (code === DisconnectReason.loggedOut || code === 401) {
                    try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch {}
                }
            }
        });

        return res.json({
            success: true,
            code,
            phone: `+${phone}`,
            message: 'Enter this code in WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number'
        });

    } catch (err) {
        activeSessions.delete(phone);
        console.error('Pair error:', err.message);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// Session status
app.get('/status/:phone', (req, res) => {
    const phone    = req.params.phone.replace(/[^0-9]/g, '');
    const infoFile = `./sessions/${phone}/info.json`;
    if (fs.existsSync(infoFile)) {
        const info = JSON.parse(fs.readFileSync(infoFile, 'utf8'));
        return res.json({ paired: true, phone: `+${phone}`, pairedAt: info.pairedAt });
    }
    res.json({ paired: false, pending: activeSessions.has(phone) });
});

// ── Start ─────────────────────────────────────────────────────────────────────
function startServer() {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(chalk.cyan(`\n🌐 ScottyMd Web Server → Port ${PORT}`));
        console.log(chalk.green(`🔗 URL: ${APP_URL}\n`));
        startKeepAlive();
    });
}

module.exports = { startServer };
