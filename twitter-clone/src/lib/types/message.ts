import type { FirestoreDataConverter, FieldValue } from 'firebase/firestore';

export type Message = {
  id: string;
  conversationId: string; // The conversation this message belongs to
  senderId: string;       // User ID of the sender
  text: string;           // Message content
  createdAt: FieldValue;      // ISO string or timestamp
  readBy: string[]; 
};

export type MessageInput = Omit<Message, 'createdAt'>;

export const messagesConverter: FirestoreDataConverter<Message> = {
  toFirestore(message) {
    return { ...message };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return { ...data } as Message;
  }
};
