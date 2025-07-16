import type { JSX } from "react";
import { Tweet, type TweetProps } from "../tweet/tweet";
import { Input } from "../input/input";

type TweetReplyModalProps = {
  tweet: TweetProps;
  closeModal: () => void;
};

export function TweetReplyModal({
  tweet,
  closeModal
}: TweetReplyModalProps): JSX.Element {
  return (
    <Input
      modal
      replyModal
      parent={{ id: tweet.id, username: tweet.user.username }}
      closeModal={closeModal}
    >
      <Tweet modal parentTweet {...tweet} />
    </Input>
  );
}
