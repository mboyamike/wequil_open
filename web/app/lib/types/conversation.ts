import type { Timestamp, FirestoreDataConverter, FieldValue } from 'firebase/firestore';
import { Stats } from 'fs';

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage?: {
    id: string;
    text: string;
    senderId: string;
    createdAt: string; // ISO string or timestamp
    readBy: string[]; // user IDs who have read
  };
  createdAt: FieldValue; // ISO string or timestamp
  updatedAt: FieldValue;
};

export const conversationConverter: FirestoreDataConverter<Conversation> = {
  toFirestore(conversation) {
    return { ...conversation };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return { ...data } as Conversation;
  }
};
