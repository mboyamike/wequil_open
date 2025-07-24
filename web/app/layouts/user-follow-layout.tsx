import { motion } from 'framer-motion';
import { Outlet } from 'react-router';
import { variants } from '~/components/aside/aside-trends';
import { Loading } from '~/components/ui/loading';
import { UserNav } from '~/components/user/user-nav';
import { useUser } from '~/lib/context/user-context';


export function UserFollowLayout(){
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
          <Outlet />
        </>
      )}
    </>
  );
}
