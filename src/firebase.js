import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCTA4vMHpyIrYQKtYHqpGssWk8zrdTtEs",
  authDomain: "mialmacendb.firebaseapp.com",
  projectId: "mialmacendb",
  storageBucket: "mialmacendb.appspot.com", // ← corregido aquí
  messagingSenderId: "335290511607",
  appId: "1:335290511607:web:9398cc0898f829d362a3f2",
  measurementId: "G-E2YNQKW1X3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
