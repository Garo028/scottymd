/**
 * ScottyMd — Settings
 * © ScottyMd by Scotty
 */
const settings = {
    packname:    'ScottyMd',
    author:      'Scotty',
    botName:     'ScottyMd',
    botOwner:    'Scotty',
    // ✅ IMPORTANT: Set your WhatsApp number here (no + or spaces)
    // Also set OWNER_NUMBER in your hosting env variables
    ownerNumber: process.env.OWNER_NUMBER || '263788114185',
    commandMode: 'public',
    maxStoreMessages: 20,
    storeWriteInterval: 10000,
    description: 'ScottyMd — Professional WhatsApp Bot',
    version: '2.0.0',
    prefix: '.',
};

module.exports = settings;
