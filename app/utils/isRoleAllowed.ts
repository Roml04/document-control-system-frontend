export enum USERROLES {
  USER = "user",
  ORIGINATOR = "originator",
  COORDINATOR = "coordinator",
  SUPERIOR = "superior",
  ADMIN = "admin",
}

export function isRoleAllowed(allowedRoles: string[] | "all", role: string) {
  if (allowedRoles === "all") {
    return true;
  }

  if (allowedRoles.includes(role)) return true;

  return false;
}
