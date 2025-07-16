import cn from 'clsx';
import type { JSX } from 'react';
import { Link } from 'react-router';
import { preventBubbling } from '~/lib/utils';
import { HeroIcon } from '../ui/hero-icon';
import type { MobileNavLink } from '../modal/mobile-sidebar-modal';

type MobileSidebarLinkProps = MobileNavLink & {
  bottom?: boolean;
};

export function MobileSidebarLink({
  href,
  bottom,
  linkName,
  iconName,
  disabled
}: MobileSidebarLinkProps): JSX.Element {
  return (
    <Link to={href} className={cn(
      `custom-button accent-tab accent-bg-tab flex items-center rounded-md font-bold 
       transition hover:bg-light-primary/10 focus-visible:ring-2 first:focus-visible:ring-[#878a8c]
       dark:hover:bg-dark-primary/10 dark:focus-visible:ring-white`,
      bottom ? 'gap-2 p-1.5 text-base' : 'gap-4 p-2 text-xl',
      disabled && 'cursor-not-allowed'
    )}
    onClick={disabled ? preventBubbling() : undefined}
    key={href}
  >
    <HeroIcon
      className={bottom ? 'h-5 w-5' : 'h-7 w-7'}
      iconName={iconName}
    />
    {linkName}
  </Link>
  );
}
