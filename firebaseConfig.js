import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
     apiKey: "AIzaSyDSy34GDmkJpkhz3m9gJMob5pqpmOXaAz4",
     authDomain: "june-code-jam-b0ad5.firebaseapp.com",
     projectId: "june-code-jam-b0ad5",
     storageBucket: "june-code-jam-b0ad5.firebasestorage.app",
     messagingSenderId: "1005830784982",
     appId: "1:1005830784982:web:fcf6c32e6aab7846f20677"
    };

    const app = initializeApp(firebaseConfig);

    export const db = getFirestore(app);