import cn from 'clsx';
import type { JSX } from 'react';
import { Link } from 'react-router';

type UserUsernameProps = {
  username: string;
  className?: string;
  disableLink?: boolean;
};

export function UserUsername({
  username,
  className,
  disableLink
}: UserUsernameProps): JSX.Element {
  return (
    <Link
      to={`/user/${username}`}
      className={cn(
        'truncate text-light-secondary dark:text-dark-secondary',
        className,
        disableLink && 'pointer-events-none'
      )}
      tabIndex={-1}
    >
      @{username}
    </Link>
  );
}
