// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJVi5qyh79FGzhZgDOVbEuoUZu9TRiaso",
  authDomain: "sistemagestionalmuerzos.firebaseapp.com",
  projectId: "sistemagestionalmuerzos",
  storageBucket: "sistemagestionalmuerzos.firebasestorage.app",
  messagingSenderId: "766529873514",
  appId: "1:766529873514:web:a0afcc544dcfe166cb0c13",
  measurementId: "G-902G9KD4EV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);