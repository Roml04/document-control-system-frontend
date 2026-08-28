import type {
  FILETYPE,
  REQUESTSTATUS,
  REQUESTTYPE,
  USERROLE,
  VERSIONSTATUS,
} from "./enums";

export type Role =
  "originator" | "coordinator" | "superior" | "manager" | "sysadmin";

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
  commenters: CommenterType[];
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
  revisionDate: string;
  approver: string;
  approvedDate: string;
  status: VERSIONSTATUS;
  fileName: string;
  filePath: string;
  fileId: number;
  requestId: number;
};

export type CommenterType = {
  userId: number;
  firstName: string;
  lastName: string;
  role: string;
  comments: CommentType[];
};

export type CommentType = {
  id: number;
  content: string;
  userId: number;
  requestId: number;
};
