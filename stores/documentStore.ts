import { create } from "zustand";
import type { DOCUMENTTYPES } from "~/routes/Requests";

type DocumentStateType = {
  documentId: number | null;
  name: string;
  type: DOCUMENTTYPES | null;
  filePath: string | null;
};

type DocumentActionType = {
  updateDocumentId: (documentId: DocumentStateType["documentId"]) => void;
  updateName: (name: DocumentStateType["name"]) => void;
  updateType: (type: DocumentStateType["type"]) => void;
  updateFilePath: (filePath: DocumentStateType["filePath"]) => void;
};

export const useDocumentStore = create<DocumentStateType & DocumentActionType>(
  (set) => ({
    documentId: null,
    name: "Unknown",
    type: null,
    filePath: null,
    updateDocumentId: (documentId: DocumentStateType["documentId"]) =>
      set(() => ({
        documentId: documentId,
      })),
    updateName: (name: DocumentStateType["name"]) =>
      set(() => ({
        name: name,
      })),

    updateType: (type: DocumentStateType["type"]) =>
      set(() => ({
        type: type,
      })),
    updateFilePath: (filePath: DocumentStateType["filePath"]) =>
      set(() => ({
        filePath: filePath,
      })),
  }),
);
