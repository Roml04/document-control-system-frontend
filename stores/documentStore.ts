import { create } from "zustand";
import type { DOCUMENTTYPES } from "~/constants";

type DocumentStateType = {
  documentId: number | null;
  name: string;
  type: DOCUMENTTYPES | null;
  filePath: string | null;
};

type DocumentActionType = {
  updateDocument: (document: Partial<DocumentStateType>) => void;
};

export const useDocumentStore = create<DocumentStateType & DocumentActionType>(
  (set) => ({
    documentId: null,
    name: "Unknown",
    type: null,
    filePath: null,
    updateDocument: (document) =>
      set((state) => ({
        ...state,
        ...document,
      })),
  }),
);
