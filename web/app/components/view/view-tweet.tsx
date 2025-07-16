import { motion } from 'framer-motion';
import cn from 'clsx';
import type { JSX, RefObject } from 'react';
import type { Tweet } from '~/lib/types/tweet';
import type { User } from '~/lib/types/user';
import { useAuth } from '~/lib/context/auth-context';
import { useModal } from '~/lib/hooks/useModal';
import { variants } from '../aside/aside-trends';
import { Modal } from '../modal/modal';
import { TweetReplyModal } from '../modal/tweet-reply-modal';
import { UserTooltip } from '../user/user-tooltip';
import { UserAvatar } from '../user/user-avatar';
import { UserUsername } from '../user/user-username';
import { ImagePreview } from '../input/image-preview';
import { TweetDate } from '../tweet/tweet-date';
import { TweetStats } from '../tweet/tweet-stats';
import { Input } from '../input/input';
import { Link } from 'react-router';
import { UserName } from '../user/user-name';
import { TweetActions } from '../tweet/tweet-actions';

type ViewTweetProps = Tweet & {
  user: User;
  viewTweetRef?: RefObject<HTMLElement>;
};

export function ViewTweet(tweet: ViewTweetProps): JSX.Element {
  const {
    id: tweetId,
    text,
    images,
    parent,
    userLikes,
    createdBy,
    createdAt,
    userRetweets,
    userReplies,
    viewTweetRef,
    user: tweetUserData
  } = tweet;

  const { id: ownerId, name, username, verified, photoURL } = tweetUserData;

  const { user } = useAuth();

  const { open, openModal, closeModal } = useModal();

  const tweetLink = `/tweet/${tweetId}`;

  const userId = user?.id as string;

  const isOwner = userId === createdBy;

  const reply = !!parent;

  const { id: parentId, username: parentUsername = username } = parent ?? {};

  return (
    <motion.article
      className={cn(
        `accent-tab h- relative flex cursor-default flex-col gap-3 border-b
         border-light-border px-4 py-3 outline-none dark:border-dark-border`,
        reply && 'scroll-m-[3.25rem] pt-0'
      )}
      initial={variants.initial}
      animate={
        variants.animate && typeof variants.animate === "object"
          ? { ...variants.animate, transition: { duration: 0.2 } }
          : { transition: { duration: 0.2 } }
      }
      exit={variants.exit}
      ref={viewTweetRef}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-visible'
        open={open}
        closeModal={closeModal}
      >
        <TweetReplyModal tweet={tweet} closeModal={closeModal} />
      </Modal>
      <div className='flex flex-col gap-2'>
        {reply && (
          <div className='flex w-12 items-center justify-center'>
            <i className='hover-animation h-2 w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
          </div>
        )}
        <div className='grid grid-cols-[auto,1fr] gap-3'>
          <UserTooltip avatar {...tweetUserData}>
            <UserAvatar src={photoURL} alt={name} username={username} />
          </UserTooltip>
          <div className='flex min-w-0 justify-between'>
            <div className='flex flex-col truncate xs:overflow-visible xs:whitespace-normal'>
              <UserTooltip {...tweetUserData}>
                <UserName
                  className='-mb-1'
                  name={name}
                  username={username}
                  verified={verified}
                />
              </UserTooltip>
              <UserTooltip {...tweetUserData}>
                <UserUsername username={username} />
              </UserTooltip>
            </div>
            <div className='px-4'>
              <TweetActions
                viewTweet
                isOwner={isOwner}
                ownerId={ownerId}
                tweetId={tweetId}
                parentId={parentId}
                username={username}
                hasImages={!!images}
                createdBy={createdBy}
              />
            </div>
          </div>
        </div>
      </div>
      {reply && (
        <p className='text-light-secondary dark:text-dark-secondary'>
          Replying to{' '}
          <Link to={`/user/${parentUsername}`} className='custom-underline text-main-accent'>
            @{parentUsername}
          </Link>
        </p>
      )}
      <div>
        {text && (
          <p className='whitespace-pre-line break-words text-2xl'>{text}</p>
        )}
        {images && (
          <ImagePreview
            viewTweet
            imagesPreview={images}
            previewCount={images.length}
          />
        )}
        <div
          className='inner:hover-animation inner:border-b inner:border-light-border
                     dark:inner:border-dark-border'
        >
          <TweetDate viewTweet tweetLink={tweetLink} createdAt={createdAt} />
          <TweetStats
            viewTweet
            reply={reply}
            userId={userId}
            isOwner={isOwner}
            tweetId={tweetId}
            userLikes={userLikes}
            userRetweets={userRetweets}
            userReplies={userReplies}
            openModal={openModal}
          />
        </div>
        <Input reply parent={{ id: tweetId, username: username }} />
      </div>
    </motion.article>
  );
}
