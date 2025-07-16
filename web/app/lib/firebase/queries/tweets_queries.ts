import { orderBy, query, where, doc } from "firebase/firestore";
import { tweetsCollection } from "../collections";

export function tweetDocumentQuery({ id }: { id: string }) {
  return doc(tweetsCollection, id);
}

export function tweetRepliesQuery({ id } : { id: string}) {
  return query(
    tweetsCollection,
    where('parent.id', '==', id),
    orderBy('createdAt', 'desc')
  );
}