import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ5bMK4GnhUEOjnc33BTi0ZpoPWWyDuhk",
  authDomain: "aw-dw-6faa7.firebaseapp.com",
  projectId: "aw-dw-6faa7",
  storageBucket: "aw-dw-6faa7.firebasestorage.app",
  messagingSenderId: "273818855726",
  appId: "1:273818855726:web:f4ece442a17964d42cb2bf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
