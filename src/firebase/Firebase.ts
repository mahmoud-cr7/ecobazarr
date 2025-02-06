/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVXMn0PT3kIitcfbHY_v7n36Vik8FQZX8",
  authDomain: "ecobazar-88fde.firebaseapp.com",
  projectId: "ecobazar-88fde",
  storageBucket: "ecobazar-88fde.firebasestorage.app",
  messagingSenderId: "320542686154",
  appId: "1:320542686154:web:63b43a6fa2b84930396d33",
  measurementId: "G-H1LKCGSFRX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
