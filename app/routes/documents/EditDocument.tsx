import { useEffect, useReducer } from "react";
import { DocumentsPageLayout, Button } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import DataBlock from "~/components/ui/DataBlock";
import { apiFetch } from "~/utils/apiFetch";
import type { DocumentType } from "../Requests";
import type { Route } from "./+types/EditDocument";
import { useRevisionStore } from "stores/revisionStore";
import FileBlock from "~/components/ui/FileBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { REVISIONSTATUS } from "~/constants";
import { useSessionStore } from "stores/sessionStore";
import { useVersionStore } from "stores/versionStore";

enum ACTION {
  SETREVISION = "SETREVISION",
  RESETREVISION = "RESETREVISION",
}

type RevisionStateType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
};

type RevisionActionType =
  | { type: ACTION.SETREVISION; payload: Partial<RevisionStateType> }
  | { type: ACTION.RESETREVISION };

type FetchedDataType = {
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
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log("EditDocument params:", params.documentId);

  const response = await apiFetch(`/document/${params.documentId}`, {
    method: "GET",
  });

  const responseBody = await response.json();

  const { message, data } = responseBody;

  if (!response.ok) {
    alert(message);
    return null;
  }

  console.log("responseBody:", responseBody);

  return {
    originator: data.originator,
    department: data.department,
    revisionNumber: data.revisionNumber,
    revisionDate: data.revisionDate,
    revisionDetails: data.revisionDetails,
    approver: data.approver,
    approvedDate: data.approvedDate,
  };
}

export default function EditDocument({ loaderData }: Route.ComponentProps) {
  /**
   * revisionId for patching revision status
   */
  const revisionId = useRevisionStore((state) => state.revisionId);
  const revisionStatus = useRevisionStore((state) => state.status);

  /**
   * versionId for patching version
   */
  const versionId = useVersionStore((state) => state.versionId);

  const userRole = useSessionStore((state) => state.role);

  const version = loaderData;

  console.log("EditDocument | version", version);
  console.log("EditDocument | revisionId", revisionId);

  const isEditable =
    isRoleAllowed(["originator"], userRole) &&
    revisionStatus === REVISIONSTATUS.ORIGINATOR;

  let versionInitState = {
    originator: "None",
    department: "None",
    revisionNumber: "None",
    revisionDate: "None",
    revisionDetails: "None",
    approver: "None",
    approvedDate: "None",
  };

  if (version) {
    versionInitState = version;
  }

  useEffect(() => {
    if (version)
      return versionDispatch({ type: ACTION.SETREVISION, payload: version });

    alert("No document loaded");
  }, []);

  const [versionState, versionDispatch] = useReducer(
    versionReducer,
    versionInitState,
  );

  function versionReducer(
    state: RevisionStateType,
    action: RevisionActionType,
  ) {
    switch (action.type) {
      case ACTION.SETREVISION:
        return {
          ...state,
          ...action.payload,
        };
      case ACTION.RESETREVISION:
        return versionInitState;

      default:
        return state;
    }
  }

  async function handleSave() {
    const {
      originator,
      department,
      revisionNumber,
      revisionDate,
      revisionDetails,
      approver,
      approvedDate,
    } = versionState;

    console.log("revisionId:", revisionId);

    const response = await apiFetch(`/version/${versionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        originator: originator,
        department: department,
        revisionNumber: revisionNumber,
        revisionDate: revisionDate,
        revisionDetails: revisionDetails,
        approver: approver,
        approvedDate: approvedDate,
      }),
    });
  }

  async function handleDiscard() {
    versionDispatch({ type: ACTION.RESETREVISION });
  }

  return (
    <div>
      <DocumentsPageLayout pagetitle="Editing">
        <div className="flex flex-col gap-4">
          {/* File Component */}
          <FileBlock documentId={null} onEditClick={() => {}} />

          <div className="grid grid-cols-4 gap-4">
            <DataBlock
              title="Originator"
              value={versionState.originator}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { originator: value },
                })
              }
            />
            <DataBlock
              title="Department"
              value={versionState.department}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { department: value },
                })
              }
            />
            <DataBlock
              title="Revision Number"
              value={versionState.revisionNumber}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { revisionNumber: value },
                })
              }
            />
            <DataBlock
              title="Date"
              value={versionState.revisionDate}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { revisionDate: value },
                })
              }
            />
            <DataBlock
              title="Revision Details"
              value={versionState.revisionDetails}
              styling="col-span-4"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { revisionDetails: value },
                })
              }
            />
            <DataBlock
              title="Approver"
              value={versionState.approver}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { approver: value },
                })
              }
            />
            <DataBlock
              title="Date"
              value={versionState.approvedDate}
              styling="col-span-2"
              isEditable={isEditable}
              onChange={(value) =>
                versionDispatch({
                  type: ACTION.SETREVISION,
                  payload: { approvedDate: value },
                })
              }
            />
          </div>
        </div>
        {true && (
          <div className="flex w-full justify-end gap-2">
            <Button
              type={BUTTONTYPES.CANCEL}
              text="Discard Changes"
              handleOnClick={handleDiscard}
            />
            <Button
              type={BUTTONTYPES.CONFIRM}
              text="Save"
              handleOnClick={handleSave}
            />
          </div>
        )}
      </DocumentsPageLayout>
    </div>
  );
}
