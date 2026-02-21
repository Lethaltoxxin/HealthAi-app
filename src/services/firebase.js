import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj5NXd5kVZvgYnkaQhx9SzLdugGvZ-o_c",
  authDomain: "healthai-app-ab6c7.firebaseapp.com",
  projectId: "healthai-app-ab6c7",
  storageBucket: "healthai-app-ab6c7.firebasestorage.app",
  messagingSenderId: "268527581953",
  appId: "1:268527581953:web:cb6c80842395e28e3fb900",
  measurementId: "G-0BQD8R9L25"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
