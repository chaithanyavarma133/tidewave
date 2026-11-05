// Run ONLY on your trusted computer, never publish service-account credentials.
// npm install firebase-admin
// Set GOOGLE_APPLICATION_CREDENTIALS to a securely stored service-account JSON path.
// node set-admin.cjs FIREBASE_USER_UID
const {initializeApp, applicationDefault} = require('firebase-admin/app');
const {getAuth} = require('firebase-admin/auth');
initializeApp({credential:applicationDefault()});
(async()=>{
  const uid=process.argv[2];
  if(!uid)throw new Error('Usage: node set-admin.cjs FIREBASE_USER_UID');
  const auth=getAuth(), user=await auth.getUser(uid);
  await auth.setCustomUserClaims(uid,{...user.customClaims,admin:true});
  console.log('Admin granted. Sign out and sign in again to refresh the token.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
