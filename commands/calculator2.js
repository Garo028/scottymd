/**
 * ScottyMd — .math command (advanced calculator)
 * Handles complex math expressions
 * © @Scottymd
 */
async function advCalcCommand(sock, chatId, message, args) {
    try {
        const expr = args.join(' ').trim();
        if (!expr) return await sock.sendMessage(chatId, { text: '❌ Usage: .math <expression>\nExamples:\n.math 2^10\n.math sqrt(144)\n.math (5*8)+100/4' }, { quoted: message });

        // Safe math only
        if (!/^[\d\s\+\-\*\/\(\)\.\%\^\,sqrtlogsincostan\.piPI]+$/i.test(expr.replace(/\s/g, ''))) {
            return await sock.sendMessage(chatId, { text: '❌ Only math expressions allowed.' }, { quoted: message });
        }

        // Replace common math functions
        let safeExpr = expr
            .replace(/\^/g, '**')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/pi/gi, 'Math.PI');

        const result = Function('"use strict"; return (' + safeExpr + ')')();
        const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

        await sock.sendMessage(chatId, {
            text: `🧮 *Calculator*\n\n📥 *Input:*\n${expr}\n\n📤 *Result:*\n*${formatted}*\n\n_© @Scottymd_`
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ Invalid expression.' }, { quoted: message });
    }
}
module.exports = advCalcCommand;
