// ====== CONFIG FIREBASE ======
const firebaseConfig = {
  apiKey: "AIzaSyAPU-EcuPAgQr9B7yoHxFw1hycP7Etjt9s",
  authDomain: "valoriarp-81a2b.firebaseapp.com",
  databaseURL: "https://valoriarp-81a2b-default-rtdb.firebaseio.com",
  projectId: "valoriarp-81a2b",
  storageBucket: "valoriarp-81a2b.firebasestorage.app",
  messagingSenderId: "83428991502",
  appId: "1:83428991502:web:ee94a00ba746916487d25f"
};

// Charge Firebase (version CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getDatabase, ref, push, set, update, onValue, remove, get }
  from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Exports pour utiliser Firebase dans les autres fichiers
export { db, ref, push, set, update, onValue, remove, get };
