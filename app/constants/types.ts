import type { DOCUMENTTYPES } from "./document.enum";
import type { REVISIONSTATUS } from "./revisionStatus.enum";

export type DocumentType = {
  id: number | null;
  name: string;
  type: DOCUMENTTYPES;
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
  filePath: string;
  fileName: string;
};

export type VersionType = {
  id: number | null;
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
  documentId: number | null;
  filePath: string;
};

export type RevisionType = {
  id: number | null;
  title: string;
  reason: string;
  status: REVISIONSTATUS;
  userId: number | null;
  documentId: number | null;
  comment: string;
};
