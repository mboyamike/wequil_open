import { SWRConfig } from 'swr';

import { Outlet } from 'react-router';
import { WindowContextProvider } from '~/lib/context/window-context';
import { Sidebar } from '~/components/sidebar/sidebar';
import { Toaster, type DefaultToastOptions } from 'react-hot-toast';
import { fetchJSON } from '~/lib/fetch';

const toastOptions: DefaultToastOptions = {
  style: {
    color: 'white',
    borderRadius: '4px',
    backgroundColor: 'rgb(var(--main-accent))'
  },
  success: { duration: 4000 }
};

export default function MainLayout() {
  return (
    <div className='flex w-full justify-center gap-0 lg:gap-4'>
      <WindowContextProvider>
        <Sidebar />
        <SWRConfig value={{ fetcher: fetchJSON }}><Outlet /></SWRConfig>
      </WindowContextProvider>
      <Toaster
        position='bottom-center'
        toastOptions={toastOptions}
        containerClassName='mb-12 xs:mb-0'
      />
    </div>
  );
}