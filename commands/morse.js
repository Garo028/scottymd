/**
 * ScottyMd — .morse command
 * Encode/decode Morse code
 * © @Scottymd
 */
const CODE = {
    'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
};
const DECODE = Object.fromEntries(Object.entries(CODE).map(([k,v]) => [v,k]));

async function morseCommand(sock, chatId, message, args) {
    try {
        const mode  = args[0]?.toLowerCase();
        const input = args.slice(1).join(' ');
        if (!mode || !input) return await sock.sendMessage(chatId, { text: '❌ Usage:\n.morse encode Hello World\n.morse decode .... . .-.. .-.. ---' }, { quoted: message });

        if (mode === 'encode') {
            const encoded = input.toUpperCase().split('').map(c => c === ' ' ? '/' : CODE[c] || c).join(' ');
            return await sock.sendMessage(chatId, { text: `📡 *Morse Encoded:*\n\n${encoded}\n\n_© @Scottymd_` }, { quoted: message });
        }
        if (mode === 'decode') {
            const decoded = input.split(' / ').map(word => word.split(' ').map(c => DECODE[c] || c).join('')).join(' ');
            return await sock.sendMessage(chatId, { text: `📡 *Morse Decoded:*\n\n${decoded}\n\n_© @Scottymd_` }, { quoted: message });
        }
        await sock.sendMessage(chatId, { text: '❌ Use: .morse encode OR .morse decode' }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Morse conversion failed.' }, { quoted: message });
    }
}
module.exports = morseCommand;
