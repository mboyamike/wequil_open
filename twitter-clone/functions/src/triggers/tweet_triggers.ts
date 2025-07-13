import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { tweetConverter, bookmarkConverter, Tweet } from "../types";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { NotificationService } from "../services/notifications_service";

export const onTweetDeleted = onDocumentDeleted('tweets/{tweetId}', async (event) => {
  const tweetId = event.params.tweetId;
  const tweetData = event.data?.data() as Tweet;

  if (!tweetData) {
    logger.info(`No tweet data found for ${tweetId}`);
    return;
  }

  logger.info(`Normalizing stats from tweet ${tweetId}`);

  const { userRetweets, userLikes } = tweetData;

  const usersStatsToDelete = new Set([...userRetweets, ...userLikes]);

  const firestore = getFirestore();
  const batch = firestore.batch();

  usersStatsToDelete.forEach((userId) => {
    logger.info(`Deleting stats from ${userId}`);

    const userStatsRef = firestore
      .doc(`users/${userId}/stats/stats`)
      .withConverter(tweetConverter);

    batch.update(userStatsRef, {
      tweets: FieldValue.arrayRemove(tweetId),
      likes: FieldValue.arrayRemove(tweetId)
    });
  });

  const bookmarksQuery = firestore
    .collectionGroup('bookmarks')
    .where('id', '==', tweetId)
    .withConverter(bookmarkConverter);

  const docsSnap = await bookmarksQuery.get();

  logger.info(`Deleting ${docsSnap.size} bookmarks`);

  docsSnap.docs.forEach(({ id, ref }) => {
    logger.info(`Deleting bookmark ${id}`);
    batch.delete(ref);
  });

  await batch.commit();

  logger.info(`Normalizing stats for tweet ${tweetId} is done`);
});

const notificationService = new NotificationService();

export const onTweetLiked = onDocumentUpdated('tweets/{tweetId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  const tweetId = event.params.tweetId;

  if (!before || !after) {
    logger.warn(`Missing before or after data for tweet ${tweetId}`);
    return;
  }

  // Check if userLikes array was modified
  const beforeLikes = before.userLikes || [];
  const afterLikes = after.userLikes || [];

  // Find new likes
  const newLikes = afterLikes.filter((userId: string) => !beforeLikes.includes(userId));

  // Create notifications for new likes
  for (const actorId of newLikes) {
    if (actorId !== after.createdBy) { // Don't notify self
      await notificationService.createNotification({
        type: 'like',
        recipientId: after.createdBy,
        actorId,
        targetType: 'tweet',
        targetId: tweetId,
        actorUsername: '', // Will be filled by the service
        actorName: '',
        actorPhotoURL: '',
        targetPreview: after.text?.substring(0, 50)
      });
    }
  }
});


export const onTweetCreated = onDocumentCreated('tweets/{tweetId}', async (event) => {
  const tweetData = event.data?.data();
  const tweetId = event.params.tweetId;

  if (!tweetData) {
    logger.warn(`No tweet data found for ${tweetId}`);
    return;
  }

  // Handle replies
  if (tweetData.parent) {
    // Get parent tweet to find who to notify
    const parentTweetDoc = await getFirestore()
      .collection('tweets')
      .doc(tweetData.parent.id)
      .get();

    if (parentTweetDoc.exists) {
      const parentTweet = parentTweetDoc.data();

      if (parentTweet && parentTweet.createdBy !== tweetData.createdBy) {
        await notificationService.createNotification({
          type: 'reply',
          recipientId: parentTweet.createdBy,
          actorId: tweetData.createdBy,
          targetType: 'tweet',
          targetId: tweetData.parent.id,
          parentType: 'tweet',
          parentId: tweetId,
          actorUsername: '',
          actorName: '',
          actorPhotoURL: '',
          targetPreview: tweetData.text?.substring(0, 50)
        });
      }
    }
  }

  // Handle mentions in parallel
  const mentions = extractMentions(tweetData.text || '');
  const mentionPromises = mentions.map(async (mentionedUsername) => {
    try {
      // Get user by username to find userId
      const userQuery = await getFirestore()
        .collection('users')
        .where('username', '==', mentionedUsername)
        .limit(1)
        .get();

      if (!userQuery.empty) {
        const mentionedUser = userQuery.docs[0];
        const mentionedUserId = mentionedUser.id;

        if (mentionedUserId !== tweetData.createdBy) {
          await notificationService.createNotification({
            type: 'mention',
            recipientId: mentionedUserId,
            actorId: tweetData.createdBy,
            targetType: 'tweet',
            targetId: tweetId,
            actorUsername: '',
            actorName: '',
            actorPhotoURL: '',
            targetPreview: tweetData.text?.substring(0, 50)
          });
        }
      }
    } catch (error) {
      logger.error(`Error processing mention for username ${mentionedUsername}:`, error);
    }
  });

  // Wait for all mention notifications to complete
  await Promise.all(mentionPromises);
});

function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}