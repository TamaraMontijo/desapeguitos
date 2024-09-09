import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
    apiKey: "AIzaSyCCZ8API5fcu3nmUiNkF2o5KLlCF7SgJhY",
    authDomain: "desapeguitos-419814.firebaseapp.com",
    projectId: "desapeguitos-419814",
    storageBucket: "desapeguitos-419814.appspot.com",
    messagingSenderId: "316769685627",
    appId: "1:316769685627:web:a1f32d7109935b6cd892de",
    measurementId: "G-K188XDVZ97"
  };
 
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)