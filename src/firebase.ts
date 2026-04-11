import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use import.meta.glob to optionally load the local config file without breaking the build if it's missing
const localConfigModule = import.meta.glob('../firebase-applet-config.json', { eager: true });
const localConfig = localConfigModule['../firebase-applet-config.json'] as any;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig?.default?.apiKey || "missing-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig?.default?.authDomain || "missing-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig?.default?.projectId || "missing-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig?.default?.storageBucket || "missing-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig?.default?.messagingSenderId || "missing-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig?.default?.appId || "missing-app-id",
};

const databaseId = import.meta.env.VITE_FIRESTORE_DATABASE_ID || localConfig?.default?.firestoreDatabaseId || '(default)';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);
