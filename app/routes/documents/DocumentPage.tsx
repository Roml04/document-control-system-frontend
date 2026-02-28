import { useEffect, useReducer, useState } from "react";
import { useSessionStore } from "stores/sessionStore";
import { PopUpModal, DocumentsPageLayout, Button } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import DataBlock from "~/components/ui/DataBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import type { Route } from "./+types/DocumentPage";
import { apiFetch } from "~/utils/apiFetch";
import type { DocumentType } from "../Requests";
import { REVISIONSTATUS } from "~/constants";

enum ACTION {
  SETDOCUMENTDETAILS = "SETDOCUMENTDETAILS",
  RESETDATA = "RESETDATA",
  SETPOPUPDETAILS = "SETPOPUPDETAILS",
}

type StateType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
  userId: number | null;
  revisionTitle: string;
  revisionReason: string;
};

type ActionType =
  | {
      type: ACTION.SETDOCUMENTDETAILS;
      payload: Partial<StateType>;
    }
  | { type: ACTION.SETPOPUPDETAILS; payload: Partial<StateType> }
  | { type: ACTION.RESETDATA };

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log("documentId:", params.documentId);

  const response = await apiFetch(`/document/${params.documentId}`, {
    method: "GET",
  });

  const responseBody: {
    message: string;
    data: {
      originator: string;
      department: string;
      revisionNumber: string;
      revisionDetails: string;
      revisionDate: string;
      approver: string;
      approvedDate: string;
      userId: number | null;
      revisionTitle: string;
      revisionReason: string;
      document: DocumentType;
    };
  } = await response.json();

  if (!response.ok) {
    alert(responseBody.message);
  }

  console.log("/document/:documentId - ", responseBody);

  return responseBody.data;
}

export default function DocumentPage({ loaderData }: Route.ComponentProps) {
  const initialState: StateType = {
    originator: "None",
    department: "None",
    revisionNumber: "None",
    revisionDetails: "None",
    revisionDate: "None",
    approver: "None",
    approvedDate: "None",
    userId: null,
    revisionTitle: "",
    revisionReason: "",
  };

  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [state, dispatch] = useReducer(documentVersionReducer, initialState);
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  const documentVersion = loaderData;

  useEffect(() => {
    console.log("documentVersion:", documentVersion);
    dispatch({
      type: ACTION.SETDOCUMENTDETAILS,
      payload: {
        ...documentVersion,
      },
    });

    console.log("state:", state);
  }, [documentVersion]);

  function documentVersionReducer(state: StateType, action: ActionType) {
    switch (action.type) {
      case ACTION.SETDOCUMENTDETAILS:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.SETPOPUPDETAILS:
        return {
          ...state,
          ...action.payload,
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
    const response = await fetch("http://127.0.0.1/api/revision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        title: state.revisionTitle,
        reason: state.revisionReason,
        status: REVISIONSTATUS.COORDINATOR,
        user_id: userId,
        document_id: documentVersion.document.id,
      }),
    });

    const revisionData = await response.json();

    if (!response.ok) {
      console.error("FAILED");
      console.error(revisionData.message);
      return;
    }

    setPopUpVisible(false);
  }

  return (
    <div>
      <DocumentsPageLayout pagetitle={documentVersion.document.name}>
        <div className="flex flex-col my-4 gap-4">
          {/* File Component */}
          <div>
            <div className="flex items-center justify-between w-full p-4 rounded-lg border border-slate-300 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-200 text-slate-600"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">File</span>
                  <span className="font-medium">waste-management.docx</span>
                </div>
              </div>
              <a
                className="px-4 py-2 text-sm rounded-md border border-slate-400 hover:bg-black hover:text-white transition"
                href=""
                target="_blank"
              >
                Open
              </a>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <DataBlock
              title="Originator"
              value={state.originator}
              styling="col-span-2"
            />
            <DataBlock
              title="Department"
              value={state.department}
              styling="col-span-2"
            />
            <DataBlock
              title="Revision Number"
              value={state.revisionNumber}
              styling="col-span-2"
            />
            <DataBlock
              title="Date"
              value={state.revisionDate}
              styling="col-span-2"
            />
            <DataBlock
              title="Revision Details"
              value={state.revisionDetails}
              styling="col-span-4"
            />
            <DataBlock
              title="Approver"
              value={state.approver}
              styling="col-span-2"
            />
            <DataBlock
              title="Date"
              value={state.approvedDate}
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
              value={state.revisionTitle}
              placeholder="Title"
              className="resize-y outline-none text-xl font-bold"
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: {
                    revisionTitle: e.target.value,
                  },
                })
              }
            />
            <textarea
              className="resize-y min-h-32 outline-none"
              value={state.revisionReason}
              placeholder="Reason for revision..."
              onChange={(e) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { revisionReason: e.target.value },
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
