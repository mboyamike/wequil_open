import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import type { User } from '../types/user';
import { useNavigate } from 'react-router';

export function useRequireAuth(redirectUrl?: string): User | null {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Loading ' + loading);
    console.log('User ' + user);
    if (!loading && !user) navigate(redirectUrl ?? '/', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return user;
}
