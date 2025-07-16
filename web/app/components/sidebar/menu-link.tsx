import { forwardRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Link } from 'react-router';

type MenuLinkProps = ComponentPropsWithRef<typeof Link> & {
  href: string;
};

// eslint-disable-next-line react/display-name
export const MenuLink = forwardRef<HTMLAnchorElement, MenuLinkProps>(
  ({ href, children, ...rest }, ref) => {
    // Remove 'to' if it exists in rest
    const { to, ...restWithoutTo } = rest as any;
    return (
      <Link to={href} ref={ref} {...restWithoutTo}>
        {children}
      </Link>
    );
  }
);
