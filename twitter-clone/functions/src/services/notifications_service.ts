import { firestore } from 'firebase-admin';
import { NotificationData } from '../types/notification';
import { FCMService } from './fcm_service';

export class NotificationService {
  private db = firestore();
  private fcmService = new FCMService();

  async createNotification(data: Omit<NotificationData, 'id' | 'createdAt' | 'read'>): Promise<void> {
    const notificationRef = this.db.collection('notifications').doc();
    
    const notification: NotificationData = {
      ...data,
      id: notificationRef.id,
      read: false,
      createdAt: firestore.Timestamp.now()
    };

    const settings = await this.getUserNotificationSettings(data.recipientId);
    if (!this.shouldCreateNotification(data.type, settings)) {
      return;
    }

    if (await this.isDuplicateNotification(notification)) {
      return;
    }

    await notificationRef.set(notification);
    
    await this.fcmService.sendNotification(data.recipientId, notification);
  }

  private async getUserNotificationSettings(userId: string) {
    const settingsDoc = await this.db
      .collection('users')
      .doc(userId)
      .collection('notificationSettings')
      .doc('preferences')
      .get();
    
    return settingsDoc.exists ? settingsDoc.data() : this.getDefaultSettings();
  }

  private async isDuplicateNotification(notification: NotificationData): Promise<boolean> {
    // Check for duplicate notifications in the last hour
    const oneHourAgo = firestore.Timestamp.fromMillis(Date.now() - 60 * 60 * 1000);
    
    const duplicateQuery = await this.db
      .collection('notifications')
      .where('recipientId', '==', notification.recipientId)
      .where('actorId', '==', notification.actorId)
      .where('type', '==', notification.type)
      .where('targetId', '==', notification.targetId)
      .where('createdAt', '>', oneHourAgo)
      .limit(1)
      .get();

    return !duplicateQuery.empty;
  }

  private shouldCreateNotification(type: string, settings: any): boolean {
    // Map notification types to settings
    const settingsMap: { [key: string]: string } = {
      'like': 'likes',
      'reply': 'replies',
      'retweet': 'shares',
      'follow': 'follows',
      'mention': 'mentions',
      'new_post': 'newTweets'
    };

    const settingKey = settingsMap[type];
    return settings?.[settingKey] ?? true; // Default to true if not set
  }

  private getDefaultSettings() {
    return {
      likes: true,
      replies: true,
      shares: true,
      follows: true,
      mentions: true,
      newTweets: true,
      pushNotifications: true
    };
  }
}