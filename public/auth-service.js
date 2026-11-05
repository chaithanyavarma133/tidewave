import { firebaseConfig } from './firebase-config.js';
export const configured = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain);
export async function services() {
  if (!configured) throw new Error('Firebase is not configured yet. Follow SETUP.md, then update firebase-config.js.');
  const [appSDK, authSDK, dbSDK] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
  ]);
  const app = appSDK.getApps().length ? appSDK.getApp() : appSDK.initializeApp(firebaseConfig);
  return { auth: authSDK.getAuth(app), db: dbSDK.getFirestore(app), a: authSDK, d: dbSDK };
}
