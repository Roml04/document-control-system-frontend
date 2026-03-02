import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { Button, DataBlock, DocumentsPageLayout } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import FileBlock from "~/components/ui/FileBlock";
import { REVISIONSTATUS } from "~/constants";
import { VERSIONSTATUS } from "~/constants/versionStatus.enum";
import { apiFetch } from "~/utils/apiFetch";

enum ACTION {
  SETDOCUMENT = "SETDOCUMENT",
  DISCARDCHANGES = "DISCARDCHANGES",
}

type DocumentStateType = {
  title: string;
  reason: string;
  name: string;
  file: File | null;
  fileName: string | null;
  filePath: string | null;
};

type DocumentActionType =
  | {
      type: ACTION.SETDOCUMENT;
      payload: Partial<DocumentStateType>;
    }
  | { type: ACTION.DISCARDCHANGES };

export default function CreateDocument() {
  const initialDocumentState = {
    title: "",
    reason: "",
    name: "",
    file: null,
    fileName: null,
    filePath: null,
  };

  const navigate = useNavigate();

  const [documentState, documentDispatch] = useReducer(
    documentReducer,
    initialDocumentState,
  );

  const userId = useSessionStore((state) => state.userId);

  useEffect(() => {
    console.log("USEEFFECT:", documentState);
  }, [documentState]);

  function documentReducer(
    state: DocumentStateType,
    action: DocumentActionType,
  ) {
    switch (action.type) {
      case ACTION.SETDOCUMENT:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.DISCARDCHANGES:
        return initialDocumentState;

      default:
        return state;
    }
  }

  async function handleSubmit() {
    if (!documentState.file) {
      return alert("No file attached");
    }

    const documentResponse = await apiFetch("/document", {
      method: "POST",
      body: JSON.stringify({
        name: documentState.name,
      }),
    });

    const document = await documentResponse.json();

    if (!documentResponse.ok) {
      alert(
        `An error occurred while creating a document\n\n${document.message}`,
      );

      return;
    }

    const revisionResponse = await apiFetch("/revision", {
      method: "POST",
      body: JSON.stringify({
        title: documentState.title,
        reason: documentState.reason,
        status: REVISIONSTATUS.COORDINATOR,
        user_id: userId,
        document_id: document.id,
      }),
    });

    const revision = await revisionResponse.json();

    if (!revisionResponse.ok) {
      return alert(
        `An error occurred while submitting your request\n\n${revision.message}`,
      );
    }

    const formData = new FormData();

    formData.append("documentId", String(document.id));
    formData.append("revisionId", String(revision.id));
    formData.append("file", documentState.file);
    formData.append("fileName", documentState.name);
    formData.append("status", VERSIONSTATUS.PENDING);

    const versionResponse = await apiFetch("/version", {
      method: "POST",
      body: formData,
    });

    console.log("FORM DATA:", formData);

    const versionBody = await versionResponse.json();

    if (!versionResponse.ok) {
      return alert(
        `An error occurred while uploading the file\n\n${versionBody.message}`,
      );
    }

    navigate(-1);
  }

  return (
    <div>
      <DocumentsPageLayout pagetitle="Request to Create a Document">
        <div className="flex flex-col my-4">
          <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-300 mb-6">
            <DataBlock
              title="Title"
              value={documentState.title}
              styling="col-span-4"
              onChange={(value) => {
                documentDispatch({
                  type: ACTION.SETDOCUMENT,
                  payload: { title: value },
                });
              }}
              isEditable={true}
            />
            <DataBlock
              title="Reason"
              value={documentState.reason}
              styling="col-span-4"
              onChange={(value) => {
                documentDispatch({
                  type: ACTION.SETDOCUMENT,
                  payload: { reason: value },
                });
              }}
              isEditable={true}
            />
          </div>
          <div className="flex flex-col gap-4">
            <DataBlock
              title="Document Name"
              value={documentState.name}
              styling="col-span-4"
              onChange={(value) => {
                documentDispatch({
                  type: ACTION.SETDOCUMENT,
                  payload: { name: value },
                });
              }}
              isEditable={true}
            />
            <FileBlock
              filename={
                documentState.fileName ? documentState.fileName : "No File Name"
              }
              isDisabled={true}
              onChange={(file) => {
                documentDispatch({
                  type: ACTION.SETDOCUMENT,
                  payload: {
                    fileName: file.name,
                    filePath: URL.createObjectURL(file),
                  },
                });
                documentDispatch({
                  type: ACTION.SETDOCUMENT,
                  payload: { file: file },
                });
              }}
              link={documentState.filePath}
            />

            <div className="flex w-full justify-end gap-2">
              <Button
                type={BUTTONTYPES.CANCEL}
                text="Discard Changes"
                handleOnClick={() => {
                  documentDispatch({ type: ACTION.DISCARDCHANGES });
                }}
              />
              <Button
                type={BUTTONTYPES.CONFIRM}
                text="Submit"
                handleOnClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </DocumentsPageLayout>
    </div>
  );
}
