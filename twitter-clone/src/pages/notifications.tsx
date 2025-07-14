import { MainContainer } from "@components/home/main-container";
import { MainHeader } from "@components/home/main-header";
import { NotificationsLayout, ProtectedLayout } from "@components/layout/common-layout";
import { MainLayout } from "@components/layout/main-layout";
import { useRouter } from "next/router";
import { ReactElement, ReactNode } from "react";

export default function Notifications(): JSX.Element {
    const { back, query: routerQuery } = useRouter();
    return (
       <MainContainer> 
        <MainHeader useActionButton title='Notifications' action={back}></MainHeader>
       </MainContainer>
    );
}

Notifications.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
    <NotificationsLayout>{page}</NotificationsLayout>
    </MainLayout>
  </ProtectedLayout>
);
  