import type { Role } from "~/constants/types";
import { useSessionStore } from "../../stores/sessionStore";

export function allowedRoles(allowedRoles: Role[] | "*") {
  const { role } = useSessionStore.getState();

  if (allowedRoles === "*") {
    return true;
  }

  if (!role || !allowedRoles.includes(role)) {
    return false;
  }

  return true;
}
