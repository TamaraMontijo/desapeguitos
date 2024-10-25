import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Monitorando o estado de autenticação do usuário e salvando no AsyncStorage
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await AsyncStorage.setItem("userUID", user.uid); // Salva o UID do usuário autenticado
  } else {
    await AsyncStorage.removeItem("userUID"); // Remove UID se o usuário fizer logout
  }
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };
