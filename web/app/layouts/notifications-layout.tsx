import { Outlet } from "react-router"
import { Aside } from "~/components/aside/aside";
import { Suggestions } from "~/components/aside/suggestions";

export function NotificationsLayout() {
  return (
    <>
      <Outlet />
      <Aside>
        <Suggestions />
      </Aside>
    </>
  );
}