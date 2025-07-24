import { useState, useEffect } from 'react';
import { useAuth } from '../lib/context/auth-context';
import { Outlet, useNavigate } from 'react-router';
import { Placeholder } from '~/components/common/placeholder';

export default function AuthLayout() {
  const [pending, setPending] = useState(true);
  

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      setPending(true);
      console.log(`user - ${user}`);

      if (user) {
        navigate('/home', { replace: true });

      } else if (!loading) {
        setPending(false);
      }
    };

    void checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);


  if (loading || pending) return <Placeholder />;

  return(
    <>
      <Outlet />
    </>
  );
}
