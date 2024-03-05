// firebase.js

// Import necessary functions from Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Import the Firebase configuration keys
import firebaseConfigKeys from './secret';

// Define the Firebase configuration object using the imported keys
const firebaseConfig = {
  apiKey: firebaseConfigKeys.REACT_APP_FIREBASE_API_KEY,
  authDomain: firebaseConfigKeys.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfigKeys.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfigKeys.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigKeys.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfigKeys.REACT_APP_FIREBASE_APP_ID,
  measurementId: firebaseConfigKeys.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Obtain an authentication instance from the Firebase app
const auth = getAuth(app);

// Export the authentication instance for use in other files
export default auth;
