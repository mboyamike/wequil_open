export interface NotificationData {
    id: string;
    type: 'like' | 'reply' | 'retweet' | 'follow' | 'mention' | 'new_post';
    recipientId: string;
    actorId: string;
    targetType: 'tweet' | 'article' | 'story' | 'user';
    targetId: string | null;
    parentType?: 'tweet' | 'project' | 'room';
    parentId?: string;
    read: boolean;
    createdAt: FirebaseFirestore.Timestamp;
    
    // Cached data for performance
    actorUsername: string;
    actorName: string;
    actorPhotoURL: string;
    targetPreview?: string;
    targetTitle?: string;
  }

  export interface FCMPayload {
    notification: {
      title: string;
      body: string;
      icon?: string;
      image?: string;
      click_action?: string;
    };
    data: {
      type: string;
      targetId: string;
      targetType: string;
      actorId: string;
      notificationId: string,
    };
  }