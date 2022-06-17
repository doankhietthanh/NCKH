import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA17AjDSgyT32nA1VyggpHcAp9frI9MXes",
  authDomain: "iotsystem-f2bdd.firebaseapp.com",
  projectId: "iotsystem-f2bdd",
  storageBucket: "iotsystem-f2bdd.appspot.com",
  messagingSenderId: "475163319606",
  appId: "1:475163319606:web:345dbec20e97a51d40e797",
  measurementId: "G-CL6ZKT2GDH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
