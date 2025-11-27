'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  if(process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    // These environment variables should be set by Firebase App Hosting, but
    // if not, we'll default to the default emulator ports.
    const authHost = process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST || "127.0.0.1";
    const authPort = process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT || 9099;
    const firestoreHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || "127.0.0.1";
    const firestorePort = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || 8080;
    connectAuthEmulator(auth, `http://${authHost}:${authPort}`);
    connectFirestoreEmulator(firestore, firestoreHost, parseInt(firestorePort));
  }
  
  return {
    firebaseApp,
    auth: auth,
    firestore: firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
