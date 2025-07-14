import { useAuth } from '@lib/context/auth-context';
import { notificationsCollection, usersCollection } from '@lib/firebase/collections';
import { query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import {
  NotificationsLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { Loading } from '@components/ui/loading';
import type { ReactElement, ReactNode } from 'react';
import type { NotificationData } from '@lib/types/notification';
import { useRouter } from 'next/router';
import { StatsEmpty } from '@components/tweet/stats-empty';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCollection } from '@lib/hooks/useCollection';

export default function Notifications(): JSX.Element {
  const { user } = useAuth();
  const { back } = useRouter();
  const router = useRouter();

  const notificationsQuery = query(
    notificationsCollection,
    where('recipientId', '==', user!.id),
    orderBy('createdAt', 'desc')
  );

  const { data: notifications, loading } = useCollection<NotificationData>(notificationsQuery);

  return (
    <MainContainer>
      <MainHeader useActionButton title='Notifications' action={back} />
      {!user?.id ? (
        <div className='flex justify-center py-10'>
          <Loading className='h-8 w-8' />
        </div>
      ) : loading ? (
        <div className='flex justify-center py-10'>
          <Loading className='h-8 w-8' />
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className='flex justify-center py-10'>
          <StatsEmpty
            title='No Notifications'
            description='You have not received any notifications yet.'
            imageData={{ src: '/assets/no-bookmarks.png', alt: 'No bookmarks' }}
          />
        </div>
      ) : (
        <ul className='divide-y divide-light-border dark:divide-dark-border'>
          {notifications?.map((notif) => {
            let content = null;
            let onClick = undefined;

            if (notif.type === 'like') {
              content = (
                <>
                  <span className="font-bold">{notif.actorName || 'Someone'}</span>
                  {' liked '}
                  <span className="font-bold">{notif.targetPreview || notif.targetType}</span>
                </>
              );
              if (notif.targetId) {
                onClick = () => router.push(`/tweet/${notif.targetId}`);
              }
            } else if (notif.type === 'follow') {
              content = (
                <>
                  <span className="font-bold">{notif.actorName || 'Someone'}</span>
                  {' followed you'}
                </>
              );
              if (notif.actorUsername) {
                onClick = () => router.push(`/user/${notif.actorUsername}`);
              }
            } else {
              content = (
                <>
                  <span className="font-bold">{notif.actorName || 'Someone'}</span>
                  {' did something'}
                </>
              );
            }

            return (
              <li
                key={notif.id}
                className='p-4 transition hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/20 cursor-pointer'
                onClick={onClick}
                tabIndex={0}
                role="button"
                onKeyPress={e => {
                  if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
                }}
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={notif.actorPhotoURL || '/assets/twitter-avatar.jpg'}
                    alt={notif.actorName || 'User'}
                    className='h-10 w-10 rounded-full object-cover'
                  />
                  <div className='min-w-0 flex-1'>
                    <div>{content}</div>
                    <div className='text-xs text-light-secondary dark:text-dark-secondary'>
                      {notif.createdAt && notif.createdAt.toDate
                        ? new Date(notif.createdAt.toDate()).toLocaleString()
                        : ''}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
