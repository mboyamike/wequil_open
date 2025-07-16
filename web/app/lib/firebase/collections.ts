import { collection } from 'firebase/firestore';
import { db } from './app';
import type { CollectionReference } from 'firebase/firestore';
import { userConverter } from '../types/user';
import { tweetConverter } from '../types/tweet';
import { conversationConverter } from '../types/conversation';
import { notificationsConverter } from '../types/notification';
import { bookmarkConverter, type Bookmark } from '../types/bookmark';
import { messagesConverter, type Message } from '../types/message';
import { statsConverter, type Stats } from '../types/stats';

export const usersCollection = collection(db, 'users').withConverter(
  userConverter
);

export const tweetsCollection = collection(db, 'tweets').withConverter(
  tweetConverter
);

export const conversationCollection = collection(db, 'conversations').withConverter(
  conversationConverter
);

export const notificationsCollection = collection(db, 'notifications').withConverter(
  notificationsConverter
);

export function userBookmarksCollection(
  id: string
): CollectionReference<Bookmark> {
  return collection(db, `users/${id}/bookmarks`).withConverter(
    bookmarkConverter
  );
}

export function userStatsCollection(id: string): CollectionReference<Stats> {
  return collection(db, `users/${id}/stats`).withConverter(statsConverter);
}

export function messagesCollection(id: string): CollectionReference<Message> {
  return collection(db, `conversations/${id}/messages`).withConverter(messagesConverter);
}

