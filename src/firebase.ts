import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDCHWMA1TeGtbx0dMh-AwNVwnIIsb7RUb8",
  authDomain: "dinar-8b9ca.firebaseapp.com",
  projectId: "dinar-8b9ca",
  storageBucket: "dinar-8b9ca.firebasestorage.app",
  messagingSenderId: "696543534966",
  appId: "1:696543534966:web:67f4169cfd3ee07006e457",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
