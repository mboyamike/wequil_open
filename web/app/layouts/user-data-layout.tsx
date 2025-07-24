import { limit, query, where } from "@firebase/firestore";
import { Outlet, useNavigate, useSearchParams } from "react-router";
import { SEO } from "~/components/common/seo";
import { MainContainer } from "~/components/home/main-container";
import { MainHeader } from "~/components/home/main-header";
import { UserHeader } from "~/components/user/user-header";
import { UserContextProvider } from "~/lib/context/user-context";
import { usersCollection } from "~/lib/firebase/collections";
import { useCollection } from "~/lib/hooks/useCollection";

export function UserDataLayout() {

  const navigate = useNavigate();
  const back = () => navigate(-1);
  const [ searchParams ] = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const { data, loading } = useCollection(
    query(usersCollection, where('username', '==', id), limit(1)),
    { allowNull: true }
  );

  const user = data ? data[0] : null;

  return (
    <UserContextProvider value={{ user, loading }}>
      {!user && !loading && <SEO title='User not found / Twitter' />}
      <MainContainer>
        <MainHeader useActionButton action={back}>
          <UserHeader />
        </MainHeader>
        <Outlet />
      </MainContainer>
    </UserContextProvider>
  );
}
