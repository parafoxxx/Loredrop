# Firebase Setup Checklist

If you're seeing "auth/configuration-not-found" or auth isn't working, follow these steps:

## ✅ Step 1: Verify Google Sign-In is Enabled

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: **loredrop-8fcb7**
3. Go to **Authentication** (left sidebar)
4. Click **Sign-in method** tab
5. Look for **Google** provider
   - If it says "Disabled" → Click it and toggle "Enable"
   - If it says "Enabled" ✅ → Good, move to step 2

## ✅ Step 2: Add Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** tab
2. Scroll down to **Authorized domains**
3. Click **Add domain** and add these domains:
   - `localhost:5173` (dev server)
   - `localhost:3000` (Convex backend)
   - `127.0.0.1:5173`
   - `localhost` (if prompted)

4. Click **Add** for each domain
5. Wait 5-10 seconds for the changes to propagate

## ✅ Step 3: Verify Environment Variables

Check that `.env.local` exists in the project root with:

```bash
VITE_FIREBASE_API_KEY=AIzaSyCXG2qWIzaHCGmUfUXDjV9fVloS1u_Mi-E
VITE_FIREBASE_AUTH_DOMAIN=loredrop-8fcb7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=loredrop-8fcb7
VITE_FIREBASE_STORAGE_BUCKET=loredrop-8fcb7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=646248425293
VITE_FIREBASE_APP_ID=1:646248425293:web:abdee51efcc872dfb57904
VITE_CONVEX_URL=http://localhost:3000
```

⚠️ **Important**: Use `.env.local` not `.env.example`

## ✅ Step 4: Restart Dev Server

```bash
# Kill the running server
Ctrl+C (in the terminal)

# Restart
pnpm dev
```

After restarting, the dev server will reload the environment variables.

## ✅ Step 5: Test Sign-In

1. Open browser console (`F12`)
2. Click the "Sign In" button
3. Watch the console for detailed error messages
4. If you see `auth/configuration-not-found`, Google Sign-In isn't enabled
5. If you see a popup → You're good! Sign in with your Google account

## 🔍 Debugging

### Open Browser Console (F12)
Look for messages like:
- ✅ `"Attempting Google Sign-In..."` → Sign-In started
- ✅ `"Sign-in successful:"` → You're logged in!
- ❌ `"Error code: auth/configuration-not-found"` → Google Sign-In not enabled
- ❌ `"Error code: auth/popup-blocked"` → Popup blocker active, allow popups

### Common Issues

| Error | Solution |
|-------|----------|
| `auth/configuration-not-found` | Enable Google Sign-In in Firebase Console |
| `auth/popup-blocked` | Allow popups in your browser |
| `auth/operation-not-allowed` | Enable Google provider in Firebase → Authentication → Sign-in method |
| Button still disabled | Check `.env.local` has all 6 Firebase variables |
| Localhost domain error | Add `localhost:5173` to Authorized Domains in Firebase |

## 📞 Need Help?

1. Check the browser console (F12) for exact error code
2. Verify all steps above are completed
3. Wait 30 seconds for Firebase to propagate changes
4. Hard refresh browser (`Ctrl+Shift+R`)
5. Restart dev server (`pnpm dev`)
