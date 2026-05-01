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

  useEffect(() => {
    // Initialize Firebase only on the client side after mount
    // Simulate a slight delay to allow the puzzle animation to be appreciated
    const timer = setTimeout(() => {
      setFirebaseServices(initializeFirebase());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show the PuzzleLoader until Firebase is initialized
  if (!firebaseServices) {
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
