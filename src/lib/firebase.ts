import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Attempt to get Firebase config from window object (e.g., injected by Firebase Hosting)
// Fallback to environment variables, then to placeholders.
let firebaseConfigFromWindow;
if (typeof window !== 'undefined' && (window as any).__firebase_config) {
  try {
    firebaseConfigFromWindow = JSON.parse((window as any).__firebase_config);
  } catch (e) {
    console.error("Error parsing __firebase_config from window", e);
  }
}

const firebaseConfig = firebaseConfigFromWindow || {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };

// Function to get initial auth token if provided globally
export const getInitialAuthToken = (): string | undefined => {
  if (typeof window !== 'undefined' && (window as any).__initial_auth_token) {
    return (window as any).__initial_auth_token;
  }
  return process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN;
};
