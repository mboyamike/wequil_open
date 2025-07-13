import { messaging } from 'firebase-admin';
import { firestore } from 'firebase-admin';
import { NotificationData, FCMPayload } from '../types/notification';

export class FCMService {
  private db = firestore();
  private fcm = messaging();

  async sendNotification(userId: string, notification: NotificationData): Promise<void> {
    try {
      const tokens = await this.getUserFCMTokens(userId);
      if (tokens.length === 0) return;

      const payload = this.createFCMPayload(notification);

      const response = await this.fcm.sendEachForMulticast({
        tokens,
        ...payload
      });

      // Clean up invalid tokens
      await this.cleanupInvalidTokens(userId, response, tokens);

    } catch (error) {
      console.error('Error sending FCM notification:', error);
    }
  }

  private async getUserFCMTokens(userId: string): Promise<string[]> {
    const tokensDoc = await this.db
      .collection('users')
      .doc(userId)
      .collection('private')
      .doc('fcmTokens')
      .get();

    return tokensDoc.exists ? Object.keys(tokensDoc.data() || {}) : [];
  }

  private createFCMPayload(notification: NotificationData): FCMPayload {
    const { title, body } = this.generateNotificationText(notification);
    
    return {
      notification: {
        title,
        body,
        icon: '/favicon.ico',
        click_action: this.generateClickAction(notification)
      },
      data: {
        type: notification.type,
        targetId: notification.targetId || '',
        targetType: notification.targetType,
        actorId: notification.actorId,
        notificationId: notification.id
      }
    };
  }

  private generateNotificationText(notification: NotificationData): { title: string; body: string } {
    const { actorName, actorUsername, type, targetType, targetPreview } = notification;
    
    switch (type) {
      case 'like':
        return {
          title: `${actorName} liked your ${targetType}`,
          body: targetPreview || `@${actorUsername} liked your ${targetType}`
        };
      case 'reply':
        return {
          title: `${actorName} replied to your ${targetType}`,
          body: targetPreview || `@${actorUsername} replied to your ${targetType}`
        };
      case 'retweet':
        return {
          title: `${actorName} retweeted your ${targetType}`,
          body: targetPreview || `@${actorUsername} retweeted your ${targetType}`
        };
      case 'follow':
        return {
          title: `${actorName} started following you`,
          body: `@${actorUsername} is now following you`
        };
      case 'mention':
        return {
          title: `${actorName} mentioned you`,
          body: targetPreview || `@${actorUsername} mentioned you in a ${targetType}`
        };
      default:
        return {
          title: 'New notification',
          body: `You have a new notification from @${actorUsername}`
        };
    }
  }

  private generateClickAction(notification: NotificationData): string {
    const baseUrl = 'https://yourapp.com';
    
    switch (notification.targetType) {
      case 'tweet':
        return `${baseUrl}/tweet/${notification.targetId}`;
      case 'article':
        return `${baseUrl}/article/${notification.targetId}`;
      case 'user':
        return `${baseUrl}/user/${notification.actorId}`;
      default:
        return `${baseUrl}/notifications`;
    }
  }

  private async cleanupInvalidTokens(userId: string, response: any, tokens: string[]): Promise<void> {
    const invalidTokens: string[] = [];
    
    response.responses.forEach((resp: any, idx: number) => {
      if (!resp.success) {
        const error = resp.error;
        if (error.code === 'messaging/invalid-registration-token' || 
            error.code === 'messaging/registration-token-not-registered') {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      const tokensRef = this.db
        .collection('users')
        .doc(userId)
        .collection('private')
        .doc('fcmTokens');

      const updates: { [key: string]: any } = {};
      invalidTokens.forEach(token => {
        updates[token] = firestore.FieldValue.delete();
      });

      await tokensRef.update(updates);
    }
  }
}