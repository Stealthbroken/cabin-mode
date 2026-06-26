# ✈️ Cabin Mode

> A focus timer disguised as a flight.

Tell Cabin Mode how long you want to study. It picks a real airport that far away, draws the great-circle route on a 3-D globe, and flies a plane along it in real time while you work. Breaks become **cabin service** on a seat-back entertainment tablet. Finish the session and your passport gets stamped.

**No build step. No server. One HTML file.**

---

## Features

- **Live flight simulation** — a WebGL globe renders the route and animates the aircraft in real time
- **Pomodoro-style timer** — configurable focus legs and break durations, or pick from presets (25/5, 45/10, 90/20, custom)
- **Cabin service breaks** — a tablet-style in-flight entertainment screen with breathing exercises, trivia, a cloud-tapping mini-game, Simon Says, and a reaction-time test
- **Boarding pass** — a printable pass generated at the start of each flight
- **Passport & frequent-flyer miles** — stamped after each session; five tiers (Blue → Silver → Gold → Platinum → Diamond) unlock extra perks
- **Spotify integration** — show the current track and control playback (requires Premium + PKCE; no client secret needed)
- **Apple Music / Cider integration** — connect to the Cider desktop app's local API
- **Cloud sync** — optional Google sign-in via Firebase lets your passport follow you across devices
- **No tracking** — data lives in your browser (`localStorage`) or your own Firebase project; nothing is shared

---

## Quick start (30 seconds)

The app uses ES modules, so open it through a local server rather than double-clicking the file:

```bash
# Python (built in)
python3 -m http.server 8080

# Node
npx serve .
```

Then visit **http://localhost:8080** — everything works out of the box in local mode.

---

## File overview

| File | Purpose |
|------|---------|
| `index.html` | The entire app — HTML, CSS, and JS in one file |
| `config.js` | Your Firebase + Spotify keys (app works without them) |
| `firebase.json` / `firestore.rules` | Optional — for Firebase Hosting + cloud profiles |
| `cider-proxy.js` | Optional — a tiny Node CORS proxy for Cider (Apple Music) |

---

## Hosting (free)

The app is a folder of static files — pick any host.

### GitHub Pages
1. Push this folder to a GitHub repo.
2. **Settings → Pages → Source:** `main` branch, root.
3. Live at `https://<you>.github.io/<repo>/`.

### Netlify or Cloudflare Pages
Drag-and-drop the folder into the Netlify dashboard, or connect the repo in Cloudflare Pages. No build command; publish directory is the folder root.

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Note your final URL — you'll need it for the Spotify redirect URI.

---

## Optional integrations

### Firebase — cloud profiles & cross-device sync

Without this, data is saved per-browser. Add Firebase to get Google sign-in and sync your passport across devices.

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication → Sign-in method →** enable **Google**.
3. **Firestore → Create database** (Production mode).
4. **Project settings → Your apps → Web app** — copy the config object into `config.js`.
5. Add your deployed domain under **Authentication → Settings → Authorized domains**.
6. Deploy the included `firestore.rules` (`firebase deploy` does this automatically with Firebase Hosting).

### Spotify — now-playing + playback control

Requires **Spotify Premium** and an active device (phone, desktop, or web player).

1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → **Create app**.
2. Add a **Redirect URI** that exactly matches your deployed page URL (including trailing slash).
3. Paste the **Client ID** into `config.js` under `spotify.clientId`. (PKCE flow — no client secret.)
4. In the app: **Audio → Connect Spotify**.

### Apple Music via Cider

1. In Cider: **Settings → Connectivity → Manage External Application Access** — enable the API.
2. In the app: **Audio → Apple Music · Cider → Connect** using `http://localhost:10767`.
3. If the browser blocks it (CORS / Private Network Access), run the bundled proxy and use port `10768`:

```bash
node cider-proxy.js
```

---

## Tier system

| Tier | Miles required | Perks |
|------|---------------|-------|
| Blue | 0 | Core timer, passport, stamps |
| Silver | 500 | Session log, daily goal tracking |
| Gold | 2 000 | Daily goal field, first-class boarding pass |
| Platinum | 5 000 | Concierge destination picker |
| Diamond | 10 000 | Custom cabin themes, passenger identity |

---

## Notes

- First load spends a moment decoding ~6,000 map points; the globe fades in when ready.
- The Spotify and Firebase flows depend on your keys and a live HTTPS URL — they can't be tested locally. Common issues: Redirect URI not matching the page URL exactly, or the deployed domain missing from Firebase's Authorized domains list.
- No analytics, no ads, no third-party tracking of any kind.
