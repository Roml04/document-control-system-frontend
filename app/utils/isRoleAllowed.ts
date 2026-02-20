export const USERROLES = [
  "user",
  "originator",
  "coordinator",
  "superior",
  "admin",
] as const;

export function isRoleAllowed(allowedRoles: string[] | "all", role: string) {
  if (allowedRoles === "all") {
    return true;
  }

  if (allowedRoles.includes(role)) return true;

  return false;
}
