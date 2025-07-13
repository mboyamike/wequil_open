import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { NotificationService } from "../services/notifications_service";

const notificationService = new NotificationService();

export const onUserFollowed = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    const userId = event.params.userId;

    if (!before || !after) {
      return;
    }

    const beforeFollowers = before.followers || [];
    const afterFollowers = after.followers || [];

    // Find new followers
    const newFollowers = afterFollowers.filter((followerId: string) => 
      !beforeFollowers.includes(followerId)
    );

    // Create notifications for new followers
    for (const actorId of newFollowers) {
      await notificationService.createNotification({
        type: 'follow',
        recipientId: userId,
        actorId,
        targetType: 'user',
        targetId: userId,
        actorUsername: '',
        actorName: '',
        actorPhotoURL: ''
      });
    }
  }
);