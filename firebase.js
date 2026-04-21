import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCu6xpiWFVylJ1nC2QUC2ik3VQk4E9UNro",
  authDomain: "military-fitness-hub.firebaseapp.com",
  projectId: "military-fitness-hub",
  storageBucket: "military-fitness-hub.firebasestorage.app",
  messagingSenderId: "320624778483",
  appId: "1:320624778483:web:6df733a9d2b0d7d1342b86"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
