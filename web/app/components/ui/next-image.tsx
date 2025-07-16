import { useState } from 'react';
import cn from 'clsx';
import type { JSX, ReactNode } from 'react';

type NextImageProps = {
  alt: string;
  width?: string | number;
  children?: ReactNode;
  useSkeleton?: boolean;
  imgClassName?: string;
  previewCount?: number;
  blurClassName?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

/**
 *
 * @description Must set width and height, if not add layout='fill'
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export function NextImage({
  src,
  alt,
  width,
  height,
  children,
  className,
  useSkeleton,
  imgClassName,
  previewCount,
  blurClassName,
  ...rest
}: NextImageProps): JSX.Element {
  const [loading, setLoading] = useState(!!useSkeleton);

  const handleLoad = (): void => setLoading(false);

  return (
    <figure style={{ width }} className={className}>
      <img
        className={cn(
          imgClassName,
          loading
            ? blurClassName ??
                'animate-pulse bg-light-secondary dark:bg-dark-secondary'
            : previewCount === 1
            ? '!h-auto !min-h-0 !w-auto !min-w-0 rounded-lg object-contain'
            : 'object-cover'
        )}
        src={src}
        width={width}
        height={height}
        alt={alt}
        onLoad={handleLoad}
        {...rest}
      />
      {children}
    </figure>
  );
}
