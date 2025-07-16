import type { JSX } from 'react';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';


type MainLayoutProps = {
  title: string;
  image?: string;
  description?: string;
};

const siteURL = 'https://your-site-url.com';

export function SEO({
  title,
  image,
  description
}: MainLayoutProps): JSX.Element {
  const location = useLocation();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='og:title' content={title} />
      {description && <meta name='description' content={description} />}
      {description && <meta name='og:description' content={description} />}
      {image && <meta property='og:image' content={image} />}
      <meta
        name='og:url'
        content={`${siteURL}${location.pathname === '/' ? '' : location.pathname}`}
      />
    </Helmet>
  );
}
