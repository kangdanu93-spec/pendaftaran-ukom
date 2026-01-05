import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// --- KONFIGURASI DATABASE ---
// Masukkan data dari Firebase Console -> Project Settings -> General -> Your Apps (CDN)
// Ganti string kosong "" dengan nilai yang Anda dapatkan.

const firebaseConfig = {
  // Contoh: apiKey: "AIzaSyDNB...",
  apiKey: "AIzaSyCeoYKwzWk1fkw2rYaxe6uqm2PQOGSWZVA",
  authDomain: "ukom-2026.firebaseapp.com",
  databaseURL: "https://ukom-2026-default-rtdb.firebaseio.com",
  projectId: "ukom-2026",
  storageBucket: "ukom-2026.firebasestorage.app",
  messagingSenderId: "14698508622",
  appId: "1:14698508622:web:a1b5f76a039d96aa442e1f",
  measurementId: "G-SBL3ZGWB3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);