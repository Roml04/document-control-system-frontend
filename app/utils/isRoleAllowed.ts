export const userRoles = [
  "user",
  "originator",
  "coordinator",
  "superior",
  "admin",
];

export function isRoleAllowed(allowedRoles: string[] | "all", role: string) {
  if (allowedRoles === "all") {
    return true;
  }

  if (allowedRoles.includes(role)) return true;

  return false;
}
