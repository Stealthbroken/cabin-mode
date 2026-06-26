/* ============================================================
   Cabin Mode — configuration
   ------------------------------------------------------------
   This file holds your OWN keys. The app works fine with the
   empty placeholders below — it just runs in "local device" mode
   (no cloud sync, no Spotify) until you fill them in.

   Nothing here is secret in the dangerous sense: Firebase web
   config and a Spotify *public* client ID are designed to live in
   client-side code. Security comes from Firebase rules + the
   OAuth redirect allow-list, not from hiding these strings.
   ============================================================ */

window.CABIN_CONFIG = {

  /* ---------- Firebase (user profiles + cross-device sync) ----------
     1. Create a project at https://console.firebase.google.com
     2. Build → Authentication → Sign-in method → enable Google
     3. Build → Firestore Database → Create database (Production mode)
     4. Project settings → "Your apps" → Web app → copy the config here
     Leave apiKey empty to disable cloud entirely (data stays on-device). */
  firebase: {
    apiKey:            "",   // e.g. "AIzaSyD....."
    authDomain:        "",   // e.g. "cabin-mode.firebaseapp.com"
    projectId:         "",   // e.g. "cabin-mode"
    storageBucket:     "",   // e.g. "cabin-mode.appspot.com"
    messagingSenderId: "",
    appId:             ""
  },

  /* ---------- Spotify (play / pause / skip + now-playing) ----------
     1. https://developer.spotify.com/dashboard → Create app
     2. In the app settings, add a Redirect URI that EXACTLY matches
        the page you deploy to, e.g.
            https://yourname.web.app/
            https://yourname.github.io/cabin-mode/
     3. Copy the Client ID here. (No client secret — this uses PKCE.)
     Leave clientId empty to hide the Spotify button.
     Controlling playback requires Spotify Premium + an active device
     (have Spotify open on a phone/desktop/web player). */
  spotify: {
    clientId:    "",         // e.g. "8f3c....e21a"
    redirectUri: ""          // optional; defaults to the current page URL
  }

};
