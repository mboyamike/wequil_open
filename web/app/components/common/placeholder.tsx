import type { JSX } from 'react';
import { SEO } from './seo';
import { CustomIcon } from '../ui/custom-icon';

export function Placeholder(): JSX.Element {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <SEO
        title='Twitter'
        description='From breaking news and entertainment to sports and politics, get the full story with all the live commentary.'
        image='/home.png'
      />
      <i>
        <CustomIcon
          className='h-20 w-20 text-[#1DA1F2]'
          iconName='TwitterIcon'
        />
      </i>
    </main>
  );
}
