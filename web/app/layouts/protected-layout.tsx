import { Outlet } from "react-router";
import { Placeholder } from "~/components/common/placeholder";
import { useRequireAuth } from "~/lib/hooks/useRequireAuth";

export default function ProtectedLayout() {
  const user = useRequireAuth();

  if (!user) return <Placeholder />;

  return <><Outlet /></>;
}