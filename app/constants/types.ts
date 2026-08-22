import type {
  FILETYPE,
  REQUESTSTATUS,
  REQUESTTYPE,
  USERROLE,
  VERSIONSTATUS,
} from "./enums";

export type UserType = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: USERROLE;
};

export type RequestType = {
  id: number;
  type: REQUESTTYPE;
  title: string;
  reason: string;
  status: REQUESTSTATUS;
  userId: number;
};

export type VersionType = {
  id: number;
  fileTitle: string;
  fileType: FILETYPE;
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  uploadDate: string;
  revisonDate: string;
  approver: string;
  approvedDate: string;
  status: VERSIONSTATUS;
  fileName: string;
  filePath: string;
  fileId: number;
  requestId: number;
};
