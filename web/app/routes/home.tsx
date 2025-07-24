import { AnimatePresence } from 'framer-motion';
import { where, orderBy } from 'firebase/firestore';
import { tweetsCollection } from '~/lib/firebase/collections';
import { useInfiniteScroll } from '~/lib/hooks/useInfiniteScroll';
import { useWindow } from '~/lib/context/window-context';
import { MainContainer } from '~/components/home/main-container';
import { MainHeader } from '~/components/home/main-header';
import { UpdateUsername } from '~/components/home/update-username';
import { Loading } from '~/components/ui/loading';
import { Input } from '~/components/input/input';
import { Tweet } from '~/components/tweet/tweet';
import { Error as AppError} from '~/components/ui/error';
import type { Route } from './+types/home';
import { isRouteErrorResponse } from 'react-router';

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
          <AppError message='Something went wrong' />
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

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}


