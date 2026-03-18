/**
 * ScottyMd — .deviceinfo command
 * Shows bot server and runtime information
 * © @Scottymd
 */
const os = require('os');
const settings = require('../settings');

async function deviceInfoCommand(sock, chatId, message) {
    try {
        const uptime   = process.uptime();
        const days     = Math.floor(uptime / 86400);
        const hours    = Math.floor((uptime % 86400) / 3600);
        const minutes  = Math.floor((uptime % 3600) / 60);
        const seconds  = Math.floor(uptime % 60);

        const ramUsed  = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
        const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(1);
        const ramFree  = (os.freemem() / 1024 / 1024).toFixed(1);
        const cpuModel = os.cpus()[0]?.model || 'Unknown';
        const cpuCount = os.cpus().length;
        const platform = os.platform();
        const arch     = os.arch();
        const nodeVer  = process.version;
        const hostname = os.hostname();

        // CPU usage snapshot
        const cpuUsage = process.cpuUsage();
        const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);

        const text = `
╔══════════════════════╗
║  🖥️ *DEVICE INFO*
╚══════════════════════╝

🤖 *Bot:* ${settings.botName} v${settings.version}
⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s

💻 *System*
• Platform: ${platform}
• Architecture: ${arch}
• Hostname: ${hostname}

⚙️ *CPU*
• Model: ${cpuModel}
• Cores: ${cpuCount}
• Usage: ${cpuPercent}s CPU time

💾 *Memory*
• Bot RAM: ${ramUsed} MB
• Total RAM: ${ramTotal} MB
• Free RAM: ${ramFree} MB

🟢 *Runtime*
• Node.js: ${nodeVer}
• PID: ${process.pid}

_© @Scottymd_
`.trim();

        await sock.sendMessage(chatId, { text }, { quoted: message });

    } catch (e) {
        console.error('DeviceInfo error:', e.message);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch device info.' }, { quoted: message });
    }
}

module.exports = deviceInfoCommand;
