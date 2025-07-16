import { useState, useEffect, type JSX } from 'react';
import type { LayoutProps } from './common-layout';
import { Placeholder } from '../common/placeholder';
import { useNavigate } from 'react-router';

export function AuthLayout({ children }: LayoutProps): JSX.Element {
  const [pending, setPending] = useState(true);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      setPending(true);

      if (user) {
        void navigate(
          '/home',
          {
            replace: true,
          },
        );
      } else if (!loading) {

        setPending(false);
      }
    };

    void checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
