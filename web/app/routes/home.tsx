import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import type { JSX, ReactElement, ReactNode } from 'react';
import { tweetsCollection } from '~/lib/firebase/collections';
import { useInfiniteScroll } from '~/lib/hooks/useInfiniteScroll';
import { useWindow } from '~/lib/context/window-context';
import { MainContainer } from '~/components/home/main-container';
import { MainHeader } from '~/components/home/main-header';
import { UpdateUsername } from '~/components/home/update-username';
import { Loading } from '~/components/ui/loading';
import { Input } from '~/components/input/input';
import { Tweet } from '~/components/tweet/tweet';
import { Error } from '~/components/ui/error';

export default function Home() {
  const { isMobile } = useWindow();

  const { data, loading, LoadMore } = useInfiniteScroll(
    tweetsCollection,
    [where('parent', '==', null), orderBy('createdAt', 'desc')],
    { includeUser: true, allowNull: true, preserve: true }
  );

  return (
    <MainContainer>
      <MainHeader
        useMobileSidebar
        title='Home'
        className='flex items-center justify-between'
      >
        <UpdateUsername />
      </MainHeader>
      {!isMobile && <Input />}
      <section className='mt-0.5 xs:mt-0'>
        {loading ? (
          <Loading className='mt-5' />
        ) : !data ? (
          <Error message='Something went wrong' />
        ) : (
          <>
            <AnimatePresence mode='popLayout'>
              {data.map((tweet) => (
                <Tweet {...tweet} key={tweet.id} />
              ))}
            </AnimatePresence>
            <LoadMore />
          </>
        )}
      </section>
    </MainContainer>
  );
}


