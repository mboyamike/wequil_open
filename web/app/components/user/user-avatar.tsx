import cn from 'clsx';
import type { JSX } from 'react';
import { NextImage } from '../ui/next-image';
import { Link } from 'react-router';

type UserAvatarProps = {
  src: string;
  alt: string;
  size?: number;
  username?: string;
  className?: string;
};

export function UserAvatar({
  src,
  alt,
  size,
  username,
  className
}: UserAvatarProps): JSX.Element {
  const pictureSize = size ?? 48;
  
  // Use wsrv for remote images
  const optimizedSrc = src.startsWith('http') 
    ? `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${pictureSize}&h=${pictureSize}&fit=cover&output=webp`
    : src;

  return (
    <Link
      to={username ? `/user/${username}` : '#'}
      className={cn(
        'blur-picture flex self-start',
        !username && 'pointer-events-none',
        className
      )}
      tabIndex={username ? 0 : -1}
    >
      <NextImage
        useSkeleton
        imgClassName='rounded-full'
        width={pictureSize}
        height={pictureSize}
        src={optimizedSrc}
        alt={alt}
        key={src}
      />
    </Link>
  );
}
