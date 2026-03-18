/**
 * ScottyMd — getSender (FINAL FIX)
 * Correctly extracts sender from any message
 * © ScottyMd by Scotty
 */

function extractNumber(val) {
    if (!val) return '';
    return String(val)
        .replace(/:\d+@.*$/, '')
        .replace(/@.*$/, '')
        .replace(/[^0-9]/g, '');
}

function normalizeJid(jid) {
    if (!jid || typeof jid !== 'string') return '';
    const clean = jid.replace(/:\d+@/, '@');
    if (clean.includes('@')) return clean.toLowerCase().trim();
    return clean.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
}

function getSender(sock, message) {
    try {
        const isGroup = message.key?.remoteJid?.endsWith('@g.us');
        let raw;
        if (message.key.fromMe) {
            raw = sock.user?.id || '';
        } else if (isGroup) {
            raw = message.key.participant
                || message.message?.extendedTextMessage?.contextInfo?.participant
                || message.key.remoteJid;
        } else {
            raw = message.key.remoteJid;
        }
        return normalizeJid(raw);
    } catch {
        return '';
    }
}

function getBotJid(sock) {
    return normalizeJid(sock.user?.id || '');
}

module.exports = { getSender, getBotJid, normalizeJid, extractNumber };
