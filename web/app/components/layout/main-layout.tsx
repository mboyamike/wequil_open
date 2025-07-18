
import { Toaster, type DefaultToastOptions } from 'react-hot-toast';
import { Sidebar } from '../sidebar/sidebar';
import type { LayoutProps } from './common-layout';
import { WindowContextProvider } from '~/lib/context/window-context';
import type { JSX } from 'react';
import { SWRConfig } from 'swr';
import { fetchJSON } from '~/lib/fetch';

const toastOptions: DefaultToastOptions = {
  style: {
    color: 'white',
    borderRadius: '4px',
    backgroundColor: 'rgb(var(--main-accent))'
  },
  success: { duration: 4000 }
};

export function MainLayout({ children }: LayoutProps): JSX.Element {
  return (
    <div className='flex w-full justify-center gap-0 lg:gap-4'>
      <WindowContextProvider>
        <Sidebar />
        <SWRConfig value={{ fetcher: fetchJSON }}>{children}</SWRConfig>
      </WindowContextProvider>
      <Toaster
        position='bottom-center'
        toastOptions={toastOptions}
        containerClassName='mb-12 xs:mb-0'
      />
    </div>
  );
}
