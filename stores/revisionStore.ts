import { create } from "zustand";
import { REVISIONSTATUS } from "~/constants";

type RevisionStateType = {
  revisionId: number | null;
  title: string;
  reason: string;
  status: REVISIONSTATUS;
  userId: number | null;
  documentId: number | null;
  comment: string;
};

type RevisionActionType = {
  updateRevision: (revision: Partial<RevisionStateType>) => void;
};

export const useRevisionStore = create<RevisionStateType & RevisionActionType>(
  (set) => ({
    revisionId: null,
    title: "",
    reason: "",
    status: REVISIONSTATUS.COORDINATOR,
    userId: null,
    documentId: null,
    comment: "",
    updateRevision: (document) =>
      set((state) => ({
        ...state,
        ...document,
      })),
  }),
);
