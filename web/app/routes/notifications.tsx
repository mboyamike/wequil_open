import { query, where, orderBy } from "firebase/firestore";
import type { JSX, ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router";
import { MainContainer } from "~/components/home/main-container";
import { MainHeader } from "~/components/home/main-header";
import { ProtectedLayout, NotificationsLayout } from "~/components/layout/common-layout";
import { MainLayout } from "~/components/layout/main-layout";
import { StatsEmpty } from "~/components/tweet/stats-empty";
import { Loading } from "~/components/ui/loading";
import { useAuth } from "~/lib/context/auth-context";
import { notificationsCollection } from "~/lib/firebase/collections";
import { useCollection } from "~/lib/hooks/useCollection";
import type { NotificationData } from "~/lib/types/notification";


function formatNotificationTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${Math.max(1, seconds)}sec`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min${minutes > 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}hr${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}day${days > 1 ? 's' : ''}`;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Notifications(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();

  const notificationsQuery = query(
    notificationsCollection,
    where('recipientId', '==', user!.id),
    orderBy('createdAt', 'desc')
  );

  const { data: notifications, loading } = useCollection<NotificationData>(notificationsQuery);

  return (
    <MainContainer>
      <MainHeader useActionButton title='Notifications' action={navigate(-1)} />
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
                onClick = () => navigate(`/tweet/${notif.targetId}`);
              }
            } else if (notif.type === 'follow') {
              content = (
                <>
                  <span className="font-bold">{notif.actorName || 'Someone'}</span>
                  {' followed you'}
                </>
              );
              if (notif.actorUsername) {
                onClick = () => navigate(`/user/${notif.actorUsername}`);
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
                        ? formatNotificationTime(new Date(notif.createdAt.toDate()))
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
