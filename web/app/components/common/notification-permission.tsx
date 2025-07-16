import type { JSX } from 'react';
import { Button } from '../ui/button';
import { useMessaging } from '~/lib/context/messaging-context';

export function NotificationPermission(): JSX.Element {
  const { isPermissionGranted, requestPermission } = useMessaging();

  if (isPermissionGranted) {
    return (
      <div className="text-sm text-green-600">
        ✓ Notifications enabled
      </div>
    );
  }

  return (
    <Button
      onClick={requestPermission}
      className="text-sm"
    >
      Enable Notifications
    </Button>
  );
} 