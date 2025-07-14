import { useCollection } from '@lib/hooks/useCollection';
import { tweetRepliesQuery } from '@lib/firebase/queries/tweets_queries';
import type { TweetWithUser } from '@lib/types/tweet';

type UseTweetRepliesOptions = {
  includeUser?: boolean;
  allowNull?: boolean;
  disabled?: boolean;
  preserve?: boolean;
};

export function useTweetReplies(
  tweetId: string,
  options: {
    includeUser: true;
    allowNull?: boolean;
    disabled?: boolean;
    preserve?: boolean;
  }
): {
  data: TweetWithUser[] | null;
  loading: boolean;
};

export function useTweetReplies(
  tweetId: string,
  options?: UseTweetRepliesOptions
): {
  data: TweetWithUser[] | null;
  loading: boolean;
};

export function useTweetReplies(
  tweetId: string,
  options?: UseTweetRepliesOptions
) {
  const query = tweetRepliesQuery({ id: tweetId });
  return useCollection(query, options);
}
