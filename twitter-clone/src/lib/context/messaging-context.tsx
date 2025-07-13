import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { messagingService } from '@lib/firebase/messaging';

interface MessagingContextType {
  fcmToken: string | null;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingContextProvider({ children }: { children: ReactNode }) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const requestPermission = async () => {
    const token = await messagingService.requestPermissionAndGetToken();
    setFcmToken(token);
    setIsPermissionGranted(!!token);
  };

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.log('This browser does not support service workers');
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Set up foreground message handler
    const unsubscribe = messagingService.onMessage((payload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification
      if (payload.notification) {
        new Notification(payload.notification.title || 'New Message', {
          body: payload.notification.body,
          icon: '/logo192.png',
          badge: '/logo192.png',
          data: payload.data
        });
      }
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <MessagingContext.Provider value={{ fcmToken, isPermissionGranted, requestPermission }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingContextProvider');
  }
  return context;
} 