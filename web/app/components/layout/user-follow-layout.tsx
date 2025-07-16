import { motion } from 'framer-motion';
import type { LayoutProps } from './common-layout';
import { useUser } from '~/lib/context/user-context';
import type { JSX } from 'react';
import { variants } from '../aside/aside-trends';
import { Loading } from '../ui/loading';
import { UserNav } from '../user/user-nav';

export function UserFollowLayout({ children }: LayoutProps): JSX.Element {
  const { user: userData, loading } = useUser();

  return (
    <>
      {!userData ? (
        <motion.section {...variants}>
          {loading ? (
            <Loading className='mt-5 w-full' />
          ) : (
            <div className='w-full p-8 text-center'>
              <p className='text-3xl font-bold'>This account doesn’t exist</p>
              <p className='text-light-secondary dark:text-dark-secondary'>
                Try searching for another.
              </p>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          <UserNav follow />
          {children}
        </>
      )}
    </>
  );
}
