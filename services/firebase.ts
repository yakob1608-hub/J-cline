// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOQrZDWq4gk2D5xh1PPYogWBFuICiBRzE",
  authDomain: "j-cline.firebaseapp.com",
  projectId: "j-cline",
  storageBucket: "j-cline.firebasestorage.app",
  messagingSenderId: "214436314434",
  appId: "1:214436314434:web:fd19ce420aed00b6e09cdb",
  measurementId: "G-HX0XBQPLVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

// Export app if needed elsewhere
export { app };