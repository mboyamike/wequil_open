import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { JSX } from 'react';
import type { SEO } from '~/components/common/seo';
import { MainContainer } from '~/components/home/main-container';
import { MainHeader } from '~/components/home/main-header';
import { Tweet } from '~/components/tweet/tweet';
import { Loading } from '~/components/ui/loading';
import { ViewParentTweet } from '~/components/view/view-parent-tweet';
import { ViewTweet } from '~/components/view/view-tweet';
import { useTweetDocument } from '~/lib/hooks/tweets/useTweetDocument';
import { useTweetReplies } from '~/lib/hooks/tweets/useTweetReplies';
import { isPlural } from '~/lib/utils';
import type { Route } from './+types/id';
import { useNavigate } from 'react-router';
import { Error } from '~/components/ui/error';

export default function TweetDetail({ params } : Route.ComponentProps) {
  const { tweetId } = params 
  const navigate = useNavigate()
  const back = () => navigate(-1)

  const { data: tweetData, loading: tweetLoading } = useTweetDocument(
    tweetId,
    { includeUser: true, allowNull: true }
  );

  const viewTweetRef = useRef<HTMLElement>(null);

  const { data: repliesData, loading: repliesLoading } = useTweetReplies(
    tweetId,
    { includeUser: true, allowNull: true }
  );

  const { text, images } = tweetData ?? {};

  const imagesLength = images?.length ?? 0;
  const parentId = tweetData?.parent?.id;

  const pageTitle = tweetData
    ? `${tweetData.user.name} on Twitter: "${text ?? ''}${
        images ? ` (${imagesLength} image${isPlural(imagesLength)})` : ''
      }" / Twitter`
    : null;

  return (
    <MainContainer className='!pb-[1280px]'>
      <MainHeader
        useActionButton
        title={parentId ? 'Thread' : 'Tweet'}
        action={() => back()}
      />
      <section>
        {tweetLoading ? (
          <Loading className='mt-5' />
        ) : !tweetData ? (
          <>
            {/* <SEO title='Tweet not found / Twitter' /> */}
            <Error message='Tweet not found' />
          </>
        ) : (
          <>
            {/* {pageTitle && <SEO title={pageTitle} />} */}
            {parentId && (
              <ViewParentTweet
                parentId={parentId}
                viewTweetRef={viewTweetRef}
              />
            )}
            <ViewTweet viewTweetRef={viewTweetRef} {...tweetData} />
            {tweetData &&
              (repliesLoading ? (
                <Loading className='mt-5' />
              ) : (
                <AnimatePresence mode='popLayout'>
                  {repliesData?.map((tweet) => (
                    <Tweet {...tweet} key={tweet.id} />
                  ))}
                </AnimatePresence>
              ))}
          </>
        )}
      </section>
    </MainContainer>
  );
}

