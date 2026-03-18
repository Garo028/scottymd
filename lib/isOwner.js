/**
 * ScottyMd — isOwner (FINAL DEFINITIVE FIX)
 * Self-contained — no circular deps
 * © ScottyMd by Scotty
 */
const fs       = require('fs');
const settings = require('../settings');

function extractNumber(val) {
    if (!val) return '';
    return String(val)
        .replace(/:\d+@.*$/, '')
        .replace(/@.*$/, '')
        .replace(/[^0-9]/g, '');
}

function isOwnerOrSudo(userId) {
    if (!userId) return false;
    const userNum = extractNumber(userId);
    if (!userNum) return false;

    // Check settings.js ownerNumber
    if (userNum === extractNumber(settings.ownerNumber)) return true;

    // Check OWNER_NUMBER env var
    const envNum = extractNumber(process.env.OWNER_NUMBER || '');
    if (envNum && userNum === envNum) return true;

    // Check data/owner.json
    try {
        const ownerFile = './data/owner.json';
        if (fs.existsSync(ownerFile)) {
            const owners = JSON.parse(fs.readFileSync(ownerFile, 'utf8'));
            if (Array.isArray(owners)) {
                return owners.some(o => extractNumber(o) === userNum);
            }
        }
    } catch {}

    return false;
}

module.exports = isOwnerOrSudo;
module.exports.isOwnerOrSudo   = isOwnerOrSudo;
module.exports.extractNumber   = extractNumber;
module.exports.normalizeNumber = extractNumber;
