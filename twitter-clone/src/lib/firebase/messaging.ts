import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirebase } from './app';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export class FirebaseMessagingService {
  private messaging;

  constructor() {
    this.messaging = getMessaging(getFirebase().firebaseApp);
  }

  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: VAPID_KEY
      });

      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  onMessage(callback: (payload: any) => void) {
    return onMessage(this.messaging, callback);
  }

  async getCurrentToken(): Promise<string | null> {
    try {
      return await getToken(this.messaging, {
        vapidKey: VAPID_KEY
      });
    } catch (error) {
      console.error('Error getting current token:', error);
      return null;
    }
  }
}

// Create singleton instance
export const messagingService = new FirebaseMessagingService(); 