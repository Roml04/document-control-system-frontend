import { USERROLE } from "~/constants";

export function isRoleAllowed(allowedRoles: string[] | "all", role: string) {
  if (allowedRoles === "all") {
    return true;
  }

  if (
    allowedRoles.includes(role) &&
    Object.values(USERROLE).includes(role as USERROLE)
  )
    return true;

  return false;
}
