// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcI0CyWAcfBYdkBquCgj9RWSdpTrqjj6g",
    authDomain: "iee-genaro-herrera.firebaseapp.com",
    projectId: "iee-genaro-herrera",
    storageBucket: "iee-genaro-herrera.firebasestorage.app",
    messagingSenderId: "380822703142",
    appId: "1:380822703142:web:1834c7a730435ee01f2ae7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
