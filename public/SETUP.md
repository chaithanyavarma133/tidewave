# Tide Wave — Firebase setup

## Included
Google popup sign-in, email/password registration and sign-in, email verification, password reset, mobile SMS OTP with reCAPTCHA, account sign-out, and a custom-claim protected admin catalog panel. Admins can publish HTTPS audio URLs and delete tracks. The music homepage loads published tracks from Firestore, alongside six original demo loops. Likes/playlists remain browser-local; audio uploads remain session-local. No user directory, payments, cloud audio uploads, or subscription system is included.

## 1. Create and configure Firebase
1. Create a project in https://console.firebase.google.com/ . Register a Web app in Project settings > Your apps.
2. Copy the public web app configuration into `firebase-config.js`. Never put service-account private keys in browser files or share them in chat.
3. Authentication > Sign-in method: enable Google (choose support email), Email/Password, and Phone.
4. Authentication > Settings > Authorized domains: explicitly add `localhost` for local testing and your real deployed domain. New projects may not include localhost automatically. If using a preview URL, add that exact hostname too. Use HTTPS for production.
5. Phone auth requires SMS configuration, permitted SMS regions, quotas, and generally a billing-enabled project. Consult the Firebase console for current regional availability and pricing. For development use Firebase's fictional phone test numbers and configured verification codes; this avoids real SMS charges. reCAPTCHA still needs a browser and network access. Never ask users to send OTPs to you.
6. Create Cloud Firestore in production mode. In its Rules tab replace the rules with `firestore.rules` and Publish. Do not use test mode or open write rules. No Storage bucket is required for this version.
7. For real audio hosting use your own HTTPS CDN/storage URLs and distribution rights. URLs are public; this is not DRM or a licensed catalog service.

## 2. Run locally on Windows
Extract the ZIP. Open the folder containing index.html, click File Explorer's address bar, type `cmd`, and Enter. Run:

```bat
py -m http.server 3000
```

Open http://localhost:3000 . Account page: http://localhost:3000/login.html . Admin: http://localhost:3000/admin.html . Keep the terminal open. Do not open the HTML using file:// — module loading and auth require an HTTP origin. Internet is required for Firebase's SDK, Google, SMS, and reCAPTCHA.

## 3. Grant yourself admin securely
1. First create your account using login.html. Find its UID in Firebase Console > Authentication > Users.
2. Install Node.js and open a terminal in a **separate trusted folder outside the website folder**. Copy `set-admin.cjs` there. Run `npm install firebase-admin`.
3. For local administration, obtain a service-account key from Project settings > Service accounts. Store it in a secure private location **outside the website folder**. Never add it to a ZIP, public hosting, source control, or chat. Alternatively use configured Application Default Credentials with appropriate IAM permissions.
4. In Windows Command Prompt set the private file path and run the script, replacing the sample values with your actual path and UID:

```bat
set GOOGLE_APPLICATION_CREDENTIALS=C:\private\firebase-service-account.json
node set-admin.cjs YOUR_ACTUAL_FIREBASE_AUTH_UID
```

5. Sign out and sign in again. Your account page will show an Admin panel button. Firestore independently verifies the admin claim on every write. Showing/hiding the UI does not grant permission.
6. Keep administrative credentials off the static host. For deployment publish only the HTML/CSS/JS browser files, hero.png and audio folder. Do not publish service-account keys, node_modules, or admin scripts. Rotate/delete a downloaded service-account key when no longer needed.

## 4. Test before launching
- Without configuration: pages show setup-required guidance, not a pretend successful login.
- Email: create an account, verify the email, refresh account, sign out, sign in, reset password.
- Google: sign in on an authorized domain; permit popups.
- Phone: test with configured fictional numbers before enabling live SMS.
- Unauthenticated and ordinary users cannot access admin UI or write/delete Firestore songs.
- After granting the admin claim, publish a licensed HTTPS track. Refresh the homepage and verify playback; delete it from admin and refresh again.
- Invalid audio URLs, unavailable files, and blocked third-party networks can prevent playback.

## Production notes
This is a Firebase-ready starter, not a fully operated streaming business. Configure App Check where supported, budget alerts, abuse monitoring, quotas, privacy/terms, and deployment security headers. Deploy the supplied rules before testing writes. Public catalog reads may incur Firestore usage; use pagination/caching before growing the catalog. Persistent browser auth is managed by Firebase. Demo likes are not synchronized between users/devices. No claim is made that live authentication has been tested against your project: no project credentials have been supplied yet.
