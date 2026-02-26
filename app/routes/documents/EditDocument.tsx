import { useEffect, useReducer } from "react";
import { useSessionStore } from "stores/sessionStore";
import { DocumentsPageLayout, Button } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import DataBlock from "~/components/ui/DataBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { apiFetch } from "~/utils/apiFetch";
import type { DocumentType } from "../Requests";
import type { Route } from "./+types/EditDocument";
import { useRevisionStore } from "stores/revisionStore";
import { changeStatus } from "~/utils/changeStatus";

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
  console.log("EditDocument:", params.documentId);

  // return;

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

    return null;
  }

  console.log("responseBody:", responseBody);

  return responseBody.data;
}

export default function EditDocument({ loaderData }: Route.ComponentProps) {
  const documentVersion = loaderData;

  let initialState: StateType = {
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

  if (documentVersion) {
    initialState = documentVersion;
  }

  const [state, dispatch] = useReducer(documentVersionReducer, initialState);
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);
  const revisionId = useRevisionStore((state) => state.revisionId);
  const revisionStatus = useRevisionStore((state) => state.status);

  const isEditable = isRoleAllowed(["originator"], role);

  useEffect(() => {
    console.log("state:", state);
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

  function handleDiscardChanges() {
    dispatch({ type: ACTION.RESETDATA });
  }

  async function handleSave(documentId: number) {
    console.log("handleSave | state:", documentId);
    const versionResponse = await apiFetch(`/version/${documentId}`, {
      method: "PATCH",
      body: JSON.stringify({
        originator: state.originator,
        department: state.department,
        revisionNumber: state.revisionNumber,
        revisionDetails: state.revisionDetails,
        revisionDate: state.revisionDate,
        approver: state.approver,
        approvedDate: state.approvedDate,
      }),
    });

    const responseBody = await versionResponse.json();

    if (!versionResponse.ok) {
      return alert(responseBody.message);
    }

    console.log("SUCCESS", responseBody);

    const revisionResponse = await apiFetch(`/revision/${revisionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: changeStatus(revisionStatus),
      }),
    });

    console.log("revisionRepsonse:", revisionResponse);
  }

  return (
    <div>
      <DocumentsPageLayout
        pagetitle={`Editing ${documentVersion ? documentVersion.document.name : "Unknown Document"}`}
      >
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
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { originator: value },
                });
              }}
            />
            <DataBlock
              title="Department"
              value={state.department}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { department: value },
                });
              }}
            />
            <DataBlock
              title="Revision Number"
              value={state.revisionNumber}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { revisionNumber: value },
                });
              }}
            />
            <DataBlock
              title="Date"
              value={state.revisionDate}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { revisionDate: value },
                });
              }}
            />
            <DataBlock
              title="Revision Details"
              value={state.revisionDetails}
              styling="col-span-4"
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { revisionDetails: value },
                });
              }}
            />
            <DataBlock
              title="Approver"
              value={state.approver}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { approver: value },
                });
              }}
            />
            <DataBlock
              title="Date"
              value={state.approvedDate}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) => {
                dispatch({
                  type: ACTION.SETDOCUMENTDETAILS,
                  payload: { approvedDate: value },
                });
              }}
            />
          </div>
        </div>
        {true && (
          <div className="flex w-full justify-end gap-2">
            <Button
              type={BUTTONTYPES.CANCEL}
              text="Discard Changes"
              handleOnClick={handleDiscardChanges}
            />
            <Button
              type={BUTTONTYPES.CONFIRM}
              text="Save"
              handleOnClick={() => {
                if (documentVersion && documentVersion.document.id) {
                  console.log(
                    "documentVersion.document.id:",
                    documentVersion.document.id,
                  );
                  handleSave(documentVersion.document.id);
                }
              }}
            />
          </div>
        )}
      </DocumentsPageLayout>
    </div>
  );
}
