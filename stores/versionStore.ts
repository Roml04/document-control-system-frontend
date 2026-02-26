import { create } from "zustand";

type VersionStateType = {
  versionId: number | null;
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

type VersionActionType = {
  updateVersion: (version: Partial<VersionActionType>) => void;
};

export const useVersionStore = create<VersionStateType & VersionActionType>(
  (set) => ({
    versionId: null,
    originator: "",
    department: "",
    revisionNumber: "",
    revisionDetails: "",
    revisionDate: "",
    approver: "",
    approvedDate: "",
    documentId: null,
    filePath: "",
    updateVersion: (version) =>
      set((state) => ({
        ...state,
        ...version,
      })),
  }),
);
