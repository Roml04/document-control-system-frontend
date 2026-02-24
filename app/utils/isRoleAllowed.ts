import { USERROLES } from "~/constants";

export function isRoleAllowed(allowedRoles: string[] | "all", role: string) {
  if (allowedRoles === "all") {
    return true;
  }

  if (
    allowedRoles.includes(role) &&
    Object.values(USERROLES).includes(role as USERROLES)
  )
    return true;

  return false;
}
