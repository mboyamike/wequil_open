import { useState, useEffect } from 'react';
import type { LayoutProps } from './common-layout';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router';
import { Placeholder } from '~/components/common/placeholder';

export default function AuthLayout({ children }: LayoutProps) {
  const [pending, setPending] = useState(true);

  const { user, loading } = useAuth();
  // const { replace } = useRouter();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      setPending(true);

      if (user) {
        // await sleep(500);
        navigate('/home', { replace: true });
        
      } else if (!loading) {
        // await sleep(500);
        setPending(false);
      }
    };

    void checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || pending) return <Placeholder />;

  return <>{children}</>;
}
