import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type Message = {
  id: string;
  pconversationId: string; // The conversation this message belongs to
  senderId: string;       // User ID of the sender
  text: string;           // Message content
  createdAt: string;      // ISO string or timestamp
  readBy: string[]; 
};

export const messagesConverter: FirestoreDataConverter<Message> = {
  toFirestore(message) {
    return { ...message };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return { ...data } as Message;
  }
};
