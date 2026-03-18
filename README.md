# 🤖 ScottyMd WhatsApp Bot
> Professional WhatsApp bot — 69+ commands — Web Pairing UI
> © ScottyMd by Scotty

---

## 🚀 Deploy on Railway (Recommended)

### Step 1 — Push to GitHub
1. Create a new repo on GitHub called `ScottyMd`
2. Upload all files from this zip to the repo
3. Make sure `session/` and `.env` are gitignored ✅

### Step 2 — Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **New Project → Deploy from GitHub repo**
4. Select your `ScottyMd` repository
5. Railway auto-detects Node.js and deploys ✅

### Step 3 — Set Environment Variables
In Railway → your project → **Variables** tab, add:

| Variable | Value |
|----------|-------|
| `OWNER_NUMBER` | `263788114185` (your number) |
| `APP_URL` | `https://yourapp.up.railway.app` (your Railway URL) |
| `NODE_VERSION` | `18` |

### Step 4 — Get your Railway URL
- Go to your app → **Settings** → **Domains**
- Click **Generate Domain**
- Copy the URL (e.g. `https://scottymd-production.up.railway.app`)
- Go back to Variables and set it as `APP_URL`

### Step 5 — Pair your number
1. Open your Railway URL in browser
2. Enter your WhatsApp number
3. Click **Get Pairing Code**
4. Open WhatsApp → Settings → Linked Devices → Link a Device
5. Choose "Link with phone number"
6. Enter the code ✅

### Step 6 — Save SESSION_ID (important!)
1. Once bot is online, send `.session` to the bot in WhatsApp
2. It sends you a file — copy ALL the contents
3. Go to Railway → Variables → Add:
   - `SESSION_ID` = paste the contents
4. Redeploy
5. Bot will now never need to re-pair on restart ✅

---

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy env file
cp .env.example .env

# 3. Edit .env — set your OWNER_NUMBER

# 4. Start
npm start
```

---

## 📋 All Commands (69+)

### ⚙️ Core
`.help` `.ping` `.alive` `.uptime` `.owner` `.deviceinfo` `.pair` `.session`

### 🔧 Info & Tools
`.weather` `.news` `.wiki` `.define` `.country` `.github` `.currency` `.calc` `.qr` `.tr` `.tts` `.remind`

### 🎵 Media & Stickers
`.sticker` `.steal` `.toimg` `.play` `.lyrics` `.vv` `.getdp` `.savestatus` `.caption` `.emojimix`

### 🎮 Fun & Games
`.joke` `.quote` `.fact` `.8ball` `.truth` `.dare` `.roast` `.ship` `.compliment` `.insult` `.tictactoe` `.poll`

### 👥 Group Management
`.kick` `.promote` `.demote` `.mute` `.unmute` `.warn` `.warnings` `.clearwarn` `.del` `.tagall` `.hidetag` `.welcome` `.goodbye` `.antilink` `.antibadword` `.chatbot` `.topmembers` `.groupinfo` `.admins` `.getlink` `.resetlink` `.setname` `.setdesc` `.setgpp`

### 🔐 Owner Control
`.mode` `.ban` `.unban` `.bc` `.autoreply` `.grouplist`

### 🤖 AI
`.ai` `.ask` `.profile`

---

## 📁 Project Structure

```
ScottyMd/
├── index.js          Main entry point
├── main.js           Command router
├── server.js         Web pairing server
├── settings.js       Bot config
├── config.js         API keys
├── railway.json      Railway deploy config
├── nixpacks.toml     Railway build config (includes ffmpeg)
├── Procfile          Process config
├── public/
│   └── index.html    Web pairing UI
├── commands/         69+ command files
├── lib/              Helper utilities
└── data/             Runtime data files
```

---

## ⚙️ Settings (settings.js)

```js
ownerNumber: '263788114185',  // Your number
botName: 'ScottyMd',
prefix: '.',
commandMode: 'public',        // 'public' or 'private'
```

---

## ⚠️ Important Notes

- **Never push** `session/` or `.env` to GitHub
- Set `NODE_VERSION=18` on Railway
- ffmpeg is included via `nixpacks.toml` for sticker commands
- `.warn` auto-kicks at 3 warnings (change `WARN_COUNT` in config.js)
- `.chatbot on` enables AI auto-response to all messages
- `.session` command gives you SESSION_ID to save in env vars

---

© ScottyMd by Scotty
