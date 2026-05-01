
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { PuzzleLoader } from '@/components/PuzzleLoader';
import { doc, getDoc } from 'firebase/firestore';
import { getSafeLogoUrl } from '@/app/lib/branding';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [puzzleImageUrl, setPuzzleImageUrl] = useState<string>('');

  useEffect(() => {
    // 1. Initialize Firebase SDKs
    const services = initializeFirebase();
    setFirebaseServices(services);

    // 2. Fetch the custom logo for the puzzle as early as possible
    const fetchLogo = async () => {
      try {
        const docRef = doc(services.firestore, 'system', 'payment');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setPuzzleImageUrl(getSafeLogoUrl(data.appLogoUrl));
        } else {
          setPuzzleImageUrl(getSafeLogoUrl());
        }
      } catch (e) {
        // Fallback to default placeholder if fetch fails
        setPuzzleImageUrl(getSafeLogoUrl());
      }
    };
    fetchLogo();

    // 3. Start the 7-second display timer
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // Show the PuzzleLoader while initializing or waiting for the 7s timer
  if (isInitializing || !firebaseServices) {
    return <PuzzleLoader imageUrl={puzzleImageUrl} />;
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
