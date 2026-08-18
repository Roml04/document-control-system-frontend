export enum USERROLE {
  GUEST = "guest",
  ORIGINATOR = "originator",
  COORDINATOR = "coordinator",
  SUPERIOR = "superior",
  MANAGER = "manager",
}

export enum REQUESTSTATUS {
  COORDINATORAPPROVAL = "coordinator_approval",
  ORIGINATOREDIT = "originator_edit",
  SUPERIORAPPROVAL = "superior_approval",
  MANAGERSAPPROVAL = "managers_approval",
  APPROVED = "approved",
  DENIED = "denied",
}
