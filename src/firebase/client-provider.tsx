
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { PuzzleLoader } from '@/components/PuzzleLoader';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Start the 7-second display timer immediately
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 7000);

    // 2. Initialize Firebase SDKs immediately so they are ready when the timer ends
    const services = initializeFirebase();
    setFirebaseServices(services);

    return () => clearTimeout(timer);
  }, []);

  // Show the PuzzleLoader while initializing or waiting for the 7s timer
  if (isInitializing || !firebaseServices) {
    return <PuzzleLoader />;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
