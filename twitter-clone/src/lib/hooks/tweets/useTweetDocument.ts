import { useDocument } from '@lib/hooks/useDocument';
import { tweetDocumentQuery } from '@lib/firebase/queries/tweets_queries';
import type { TweetDocumentOptions, TweetWithUser } from '@lib/types/tweet';

export function useTweetDocument(
  tweetId: string,
  options: {
    includeUser: true;
    allowNull?: boolean;
    disabled?: boolean;
  }
): {
  data: TweetWithUser | null;
  loading: boolean;
};

export function useTweetDocument(
  tweetId: string,
  options?: TweetDocumentOptions
): {
  data: TweetWithUser | null;
  loading: boolean;
};

export function useTweetDocument(
  tweetId: string,
  options?: TweetDocumentOptions
) {
  const docRef = tweetDocumentQuery({ id: tweetId });
  return useDocument(docRef, options);
} 