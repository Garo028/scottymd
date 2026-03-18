/**
 * ScottyMd — Auto Join
 * Automatically joins Scotty's channel and group when bot connects
 */

const SCOTTY_CHANNEL = '0029Vb61NmpLikg7gNFyV23w'; // channel link code
const SCOTTY_GROUP   = 'Hm6zBNNz93t6aZ2XjSgzu7';   // group invite code

async function autoJoinScotty(sock) {
    try {
        // Join channel (newsletter follow)
        try {
            await sock.newsletterFollow(`120363422591784062@newsletter`);
            console.log('✅ Followed ScottyMd channel');
        } catch { }

        // Join group
        try {
            await sock.groupAcceptInvite(SCOTTY_GROUP);
            console.log('✅ Joined ScottyMd group');
        } catch { }

    } catch (e) {
        // Silently ignore if already joined or failed
    }
}

module.exports = { autoJoinScotty };
