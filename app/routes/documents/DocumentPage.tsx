import { useEffect, useLayoutEffect, useReducer, useState } from "react";
import { useSessionStore } from "stores/sessionStore";
import { PopUpModal, DocumentsPageLayout, Button } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import DataBlock from "~/components/ui/DataBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import type { Route } from "./+types/DocumentPage";
import { apiFetch } from "~/utils/apiFetch";
import { REVISIONSTATUS } from "~/constants";
import FileBlock from "~/components/ui/FileBlock";

enum ACTION {
  SETALLDATA = "SETALLDATA",
  SETDOCUMENT = "SETDOCUMENT",
  SETVERSION = "SETVERSION",
  SETREVISION = "SETREVISION",
  RESETDATA = "RESETDATA",
  SETPOPUPDETAILS = "SETPOPUPDETAILS",
}

type StateType = {
  document: DocumentType;
  version: VersionType;
  revision: RevisionType;
};

type VersionType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
  userId: number | null;
  filePath: string | null;
  fileName: string | null;
};

type DocumentType = {
  id: number | null;
  name: string;
};

type RevisionType = {
  title: string;
  reason: string;
  status: REVISIONSTATUS;
  userId: number | null;
  documentId: number | null;
  comment: string;
};

type ActionType =
  | { type: ACTION.SETALLDATA; payload: StateType }
  | {
      type: ACTION.SETDOCUMENT;
      payload: Partial<DocumentType>;
    }
  | {
      type: ACTION.SETVERSION;
      payload: Partial<VersionType>;
    }
  | {
      type: ACTION.SETREVISION;
      payload: Partial<RevisionType>;
    }
  | { type: ACTION.RESETDATA };

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await apiFetch(`/document/${params.documentId}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
  }

  console.log(`/document/no`, data);

  return data;
}

export default function DocumentPage({ loaderData }: Route.ComponentProps) {
  const initialState: StateType = {
    version: {
      originator: "",
      department: "",
      revisionNumber: "",
      revisionDetails: "",
      revisionDate: "",
      approver: "",
      approvedDate: "",
      userId: null,
      filePath: null,
      fileName: null,
    },
    document: {
      id: null,
      name: "Untitled Document",
    },
    revision: {
      title: "",
      reason: "",
      status: REVISIONSTATUS.COORDINATOR,
      userId: null,
      documentId: null,
      comment: "",
    },
  };

  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [state, dispatch] = useReducer(documentVersionReducer, initialState);
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  const documentVersion = loaderData;

  useEffect(() => {
    if (documentVersion) {
      return dispatch({
        type: ACTION.SETALLDATA,
        payload: {
          ...documentVersion,
        },
      });
    }
    dispatch({
      type: ACTION.SETALLDATA,
      payload: initialState,
    });
  }, []);

  function documentVersionReducer(state: StateType, action: ActionType) {
    switch (action.type) {
      case ACTION.SETALLDATA:
        return {
          ...state,
          ...action.payload,
        };
      case ACTION.SETDOCUMENT:
        return {
          ...state,
          document: { ...state.document, ...action.payload },
        };

      case ACTION.SETVERSION:
        return {
          ...state,
          version: { ...state.version, ...action.payload },
        };

      case ACTION.SETREVISION:
        return {
          ...state,
          revision: { ...state.revision, ...action.payload },
        };

      case ACTION.RESETDATA:
        return initialState;

      default:
        return state;
    }
  }

  function handleRevisionClick() {
    setPopUpVisible(true);
  }

  function handleObsoleteClick() {}

  function handleCancel() {
    setPopUpVisible(false);
  }

  async function handleSubmit() {
    console.log("handleSubmit | document.id:", state.document.id);
    const response = await fetch("http://127.0.0.1/api/revision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: state.revision.title,
        reason: state.revision.reason,
        status: REVISIONSTATUS.COORDINATOR,
        user_id: userId,
        document_id: documentVersion.document.id,
      }),
    });

    const revisionData = await response.json();

    if (!response.ok) {
      console.error("ERROR:", revisionData.message);
      return;
    }

    setPopUpVisible(false);
  }

  return (
    <div>
      <DocumentsPageLayout
        pagetitle={
          documentVersion.document.name
            ? documentVersion.document.name
            : "Untitled document"
        }
      >
        <div className="flex flex-col my-4 gap-4">
          {/* File Component */}
          <FileBlock
            filename={
              state.version.fileName
                ? state.version.fileName
                : "Untitled document"
            }
            link={state.version.filePath}
            isDisabled={true}
            canUpload={false}
          />
          <div className="grid grid-cols-4 gap-4">
            <DataBlock
              title="Originator"
              value={state.version.originator}
              styling="col-span-2"
            />
            <DataBlock
              title="Department"
              value={state.version.department}
              styling="col-span-2"
            />
            <DataBlock
              title="Revision Number"
              value={state.version.revisionNumber}
              styling="col-span-2"
            />
            <DataBlock
              title="Date"
              value={state.version.revisionDate}
              styling="col-span-2"
            />
            <DataBlock
              title="Revision Details"
              value={state.version.revisionDetails}
              styling="col-span-4"
            />
            <DataBlock
              title="Approver"
              value={state.version.approver}
              styling="col-span-2"
            />
            <DataBlock
              title="Date"
              value={state.version.approvedDate}
              styling="col-span-2"
            />
          </div>
        </div>
        {isRoleAllowed(["originator", "coordinator"], role) && (
          <div className="flex w-full justify-end gap-2">
            <button
              onClick={handleRevisionClick}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Revision
            </button>
            <button
              onClick={handleObsoleteClick}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Obsolete
            </button>
          </div>
        )}
      </DocumentsPageLayout>
      {isPopUpVisible && (
        <PopUpModal onClose={() => {}}>
          {/* <h2>Reason for Revision</h2> */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={state.revision.title}
              placeholder="Title"
              className="resize-y outline-none text-xl font-bold"
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETREVISION,
                  payload: {
                    title: e.target.value,
                  },
                })
              }
            />
            <textarea
              className="resize-y min-h-32 outline-none"
              value={state.revision.reason}
              placeholder="Reason for revision..."
              onChange={(e) => {
                dispatch({
                  type: ACTION.SETREVISION,
                  payload: { reason: e.target.value },
                });
              }}
            />
          </div>
          <div className="flex w-full justify-between gap-2">
            <Button
              type={BUTTONTYPES.CANCEL}
              text="Cancel"
              handleOnClick={handleCancel}
              styling="w-full"
            />
            <Button
              type={BUTTONTYPES.CONFIRM}
              text="Submit"
              handleOnClick={handleSubmit}
              styling="w-full"
            />
          </div>
        </PopUpModal>
      )}
    </div>
  );
}
