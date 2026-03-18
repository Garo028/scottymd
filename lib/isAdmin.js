/**
 * ScottyMd — isAdmin (FINAL DEFINITIVE FIX)
 * Self-contained — no external dependencies
 * © ScottyMd by Scotty
 */

const groupCache = new Map();
const CACHE_TTL  = 5000;

// Extract pure number from ANY JID format — self-contained
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

async function getGroupMeta(sock, groupId) {
    const cached = groupCache.get(groupId);
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
    const data = await sock.groupMetadata(groupId);
    groupCache.set(groupId, { data, ts: Date.now() });
    return data;
}

function clearGroupCache(groupId) {
    if (groupId) groupCache.delete(groupId);
    else groupCache.clear();
}

async function isAdmin(sock, groupId, userId) {
    try {
        if (!sock || !groupId || !userId) return false;
        const userNum = extractNumber(userId);
        if (!userNum) return false;
        const meta = await getGroupMeta(sock, groupId);
        return meta.participants.some(p => {
            if (!p.admin) return false;
            return extractNumber(p.id) === userNum;
        });
    } catch (e) {
        console.error('isAdmin error:', e.message);
        return false;
    }
}

async function isBotAdmin(sock, groupId) {
    try {
        const botId = sock.user?.id || '';
        if (!botId) return false;
        return await isAdmin(sock, groupId, botId);
    } catch { return false; }
}

async function getAdmins(sock, groupId) {
    try {
        const meta = await getGroupMeta(sock, groupId);
        return meta.participants
            .filter(p => p.admin)
            .map(p => normalizeJid(p.id));
    } catch { return []; }
}

module.exports               = isAdmin;
module.exports.isAdmin       = isAdmin;
module.exports.isBotAdmin    = isBotAdmin;
module.exports.getAdmins     = getAdmins;
module.exports.normalizeJid  = normalizeJid;
module.exports.normalizeNumber = extractNumber;
module.exports.extractNumber = extractNumber;
module.exports.clearGroupCache = clearGroupCache;
