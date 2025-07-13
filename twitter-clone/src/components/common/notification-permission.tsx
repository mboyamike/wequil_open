import { useMessaging } from '@lib/context/messaging-context';
import { Button } from '@components/ui/button';

export function NotificationPermission() {
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