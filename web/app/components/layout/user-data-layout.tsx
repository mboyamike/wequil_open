import { query, where, limit } from 'firebase/firestore';
import type { LayoutProps } from './common-layout';
import type { JSX } from 'react';
import { useCollection } from '~/lib/hooks/useCollection';
import { usersCollection } from '~/lib/firebase/collections';
import { UserContextProvider } from '~/lib/context/user-context';
import { SEO } from '../common/seo';
import { MainContainer } from '../home/main-container';
import { MainHeader } from '../home/main-header';
import { UserHeader } from '../user/user-header';
import { useNavigate, useParams } from 'react-router';
import type { User } from '~/lib/types/user';

export function UserDataLayout({ children }: LayoutProps): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading } = useCollection(
    query(usersCollection, where('username', '==', id), limit(1)),
    { allowNull: true }
  );

  const user = data ? (data[0] as User) : null;

  return (
    <UserContextProvider value={{ user, loading }}>
      {!user && !loading && <SEO title='User not found / Twitter' />}
      <MainContainer>
        <MainHeader useActionButton action={() => navigate(-1)}>
          <UserHeader />
        </MainHeader>
        {children}
      </MainContainer>
    </UserContextProvider>
  );
}
