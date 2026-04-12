import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRLzjYcgXp1eb9Ytr85qMCsavnCuOc_YU",
  authDomain: "makedesign-27964.firebaseapp.com",
  projectId: "makedesign-27964",
  storageBucket: "makedesign-27964.firebasestorage.app",
  messagingSenderId: "27899909226",
  appId: "1:27899909226:web:2c7eb1d6e84be68fd4e613",
  measurementId: "G-FY32959R1P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
