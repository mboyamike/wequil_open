import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import type { Variants } from 'framer-motion';
import type { User } from '~/lib/types/user';
import type { JSX } from 'react';
import { useAuth } from '~/lib/context/auth-context';
import { useModal } from '~/lib/hooks/useModal';
import { Modal } from '../modal/modal';
import { TweetReplyModal } from '../modal/tweet-reply-modal';
import { TweetStatus } from './tweet-status';
import { UserTooltip } from '../user/user-tooltip';
import { UserAvatar } from '../user/user-avatar';
import { UserName } from '../user/user-name';
import { UserUsername } from '../user/user-username';
import { TweetDate } from './tweet-date';
import { TweetActions } from './tweet-actions';
import { ImagePreview } from '../input/image-preview';
import { TweetStats } from './tweet-stats';
import { Link } from 'react-router';
import { delayScroll } from '~/lib/utils';

export type TweetProps = {
  id: string;
  text: string | null;
  images: any | null;
  parent: { id: string; username: string } | null;
  userLikes: string[];
  createdBy: string;
  createdAt: any;
  updatedAt: any | null;
  userReplies: number;
  userRetweets: string[];
  user: User;
  modal?: boolean;
  pinned?: boolean;
  profile?: User | null;
  parentTweet?: boolean;
};

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export function Tweet(tweet: TweetProps): JSX.Element {
  const {
    id: tweetId,
    text,
    modal,
    images,
    parent,
    pinned,
    profile,
    userLikes,
    createdBy,
    createdAt,
    parentTweet,
    userReplies,
    userRetweets,
    user: tweetUserData
  } = tweet;

  const { id: ownerId, name, username, verified, photoURL } = tweetUserData;

  const { user } = useAuth();

  const { open, openModal, closeModal } = useModal();

  const tweetLink = `/tweet/${tweetId}`;

  const userId = user?.id as string;

  const isOwner = userId === createdBy;

  const { id: parentId, username: parentUsername = username } = parent ?? {};

  const {
    id: profileId,
    name: profileName,
    username: profileUsername
  } = profile ?? {};

  const reply = !!parent;
  const tweetIsRetweeted = userRetweets.includes(profileId ?? '');

  return (
    <motion.article
      {...(!modal ? { ...variants, layout: 'position' } : {})}
      animate={{
        ...variants.animate,
        ...(parentTweet && { transition: { duration: 0.2 } })
      }}
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full my-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <TweetReplyModal tweet={tweet} closeModal={closeModal} />
      </Modal>
      <Link
        to={tweetLink}
        className={cn(
          `accent-tab hover-card relative flex flex-col 
           gap-y-4 px-4 py-3 outline-none duration-200`,
          parentTweet
            ? 'mt-0.5 pt-2.5 pb-0'
            : 'border-b border-light-border dark:border-dark-border'
        )}
        draggable={false}
        onClick={delayScroll(200)}
      >
        <div className='grid grid-cols-[auto,1fr] gap-x-3 gap-y-1'>
          <AnimatePresence initial={false}>
            {modal ? null : pinned ? (
              <TweetStatus type='pin'>
                <p className='text-sm font-bold'>Pinned Tweet</p>
              </TweetStatus>
            ) : (
              tweetIsRetweeted && (
                <TweetStatus type='tweet'>
                  <Link
                    to={profileUsername as string}
                    className='custom-underline truncate text-sm font-bold'
                  >
                    {userId === profileId ? 'You' : profileName} Retweeted
                  </Link>
                </TweetStatus>
              )
            )}
          </AnimatePresence>
          <div className='flex flex-col items-center gap-2'>
            <UserTooltip avatar modal={modal} {...tweetUserData}>
              <UserAvatar src={photoURL} alt={name} username={username} />
            </UserTooltip>
            {parentTweet && (
              <i className='hover-animation h-full w-0.5 bg-light-line-reply dark:bg-dark-line-reply' />
            )}
          </div>
          <div className='flex min-w-0 flex-col'>
            <div className='flex justify-between gap-2 text-light-secondary dark:text-dark-secondary'>
              <div className='flex gap-1 truncate xs:overflow-visible xs:whitespace-normal'>
                <UserTooltip modal={modal} {...tweetUserData}>
                  <UserName
                    name={name}
                    username={username}
                    verified={verified}
                    className='text-light-primary dark:text-dark-primary'
                  />
                </UserTooltip>
                <UserTooltip modal={modal} {...tweetUserData}>
                  <UserUsername username={username} />
                </UserTooltip>
                <TweetDate tweetLink={tweetLink} createdAt={createdAt} />
              </div>
              <div className='px-4'>
                {!modal && (
                  <TweetActions
                    isOwner={isOwner}
                    ownerId={ownerId}
                    tweetId={tweetId}
                    parentId={parentId}
                    username={username}
                    hasImages={!!images}
                    createdBy={createdBy}
                  />
                )}
              </div>
            </div>
            {(reply || modal) && (
              <p
                className={cn(
                  'text-light-secondary dark:text-dark-secondary',
                  modal && 'order-1 my-2'
                )}
              >
                Replying to{' '}
                <Link
                  to={`/user/${parentUsername}`}
                  className='custom-underline text-main-accent'
                >
                  @{parentUsername}
                </Link>
              </p>
            )}
            {text && (
              <p className='whitespace-pre-line break-words'>{text}</p>
            )}
            <div className='mt-1 flex flex-col gap-2'>
              {images && (
                <ImagePreview
                  tweet
                  imagesPreview={images}
                  previewCount={images.length}
                />
              )}
              {!modal && (
                <TweetStats
                  reply={reply}
                  userId={userId}
                  isOwner={isOwner}
                  tweetId={tweetId}
                  userLikes={userLikes}
                  userReplies={userReplies}
                  userRetweets={userRetweets}
                  openModal={!parent ? openModal : undefined}
                />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}