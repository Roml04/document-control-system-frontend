import { useEffect, useReducer } from "react";
import { DocumentsPageLayout, Button } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import DataBlock from "~/components/ui/DataBlock";
import { apiFetch } from "~/utils/apiFetch";
import type { Route } from "./+types/EditDocument";
import FileBlock from "~/components/ui/FileBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { REVISIONSTATUS } from "~/constants";
import { useSessionStore } from "stores/sessionStore";
import { changeStatus } from "~/utils/changeStatus";
import { useNavigate } from "react-router";
import { VERSIONSTATUS } from "~/constants/versionStatus.enum";

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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await apiFetch(
    `/document/${params.documentId}/revision/${params.revisionId}`,
    {
      method: "GET",
    },
  );

  const responseBody = await response.json();

  if (!response.ok) {
    alert(`Error: ${responseBody.message}`);
    return null;
  }

  console.log(`/document/${params.documentId}/revision/${params.revisionId}`);
  console.log("RESPONSE:", responseBody);

  const { revision, version, document } = responseBody;
  console.log("PATH", version.file_path);

  return {
    version: {
      id: version.id,
      originator: version.originator,
      department: version.department,
      revisionNumber: version.revision_number,
      revisionDetails: version.revision_details,
      revisionDate: version.revision_date,
      approver: version.approver,
      approvedDate: version.approved_date,
      documentId: version.document_id,
      filePath: version.file_path,
      fileName: version.filename,
    },
    revision: {
      id: revision.id,
      title: revision.title,
      reason: revision.reason,
      status: revision.status,
      userId: revision.userId,
      documentId: revision.document_id,
      comment: revision.comment,
    },
    document: {
      id: document.id,
      name: document.name,
      type: document.type,
    },
  };
}

export default function EditDocument({ loaderData }: Route.ComponentProps) {
  const userRole = useSessionStore((state) => state.role);
  const navigate = useNavigate();

  if (!loaderData) {
    throw new Error("No data loaded");
  }

  const { version, revision, document } = loaderData;

  const isEditable =
    isRoleAllowed(["originator", "coordinator"], userRole) &&
    revision.status === REVISIONSTATUS.ORIGINATOR;

  const documentExists = version.id && document.id;

  let versionInitState = {
    originator: "",
    department: "",
    revisionNumber: "",
    revisionDate: "",
    revisionDetails: "",
    approver: "",
    approvedDate: "",
  };

  if (documentExists) {
    versionInitState = {
      originator: version.originator,
      department: version.department,
      revisionNumber: version.revisionNumber,
      revisionDetails: version.revisionDetails,
      revisionDate: version.revisionDate,
      approver: version.approver,
      approvedDate: version.approvedDate,
    };
  }

  const [versionState, versionDispatch] = useReducer(
    versionReducer,
    versionInitState,
  );

  useEffect(() => {
    if (documentExists) {
      return versionDispatch({
        type: ACTION.SETREVISION,
        payload: versionInitState,
      });
    }

    versionDispatch({ type: ACTION.SETREVISION, payload: versionInitState });
  }, [version]);

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

  async function handleSubmit() {
    const {
      originator,
      department,
      revisionNumber,
      revisionDate,
      revisionDetails,
      approver,
      approvedDate,
    } = versionState;

    const versionResponse = await apiFetch(`/version`, {
      method: "POST",
      body: JSON.stringify({
        originator: originator,
        department: department,
        revisionNumber: revisionNumber,
        revisionDate: revisionDate,
        revisionDetails: revisionDetails,
        approver: approver,
        approvedDate: approvedDate,
        documentId: document.id,
        status: VERSIONSTATUS.PENDING,
      }),
    });

    const data = await versionResponse.json();

    if (!versionResponse.ok) {
      // return alert("Something went wrong when submitting your changes");
      return alert(data.message);
    }

    const revisionResponse = await apiFetch(`/revision/${revision.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: changeStatus(revision.status),
      }),
    });

    if (!revisionResponse.ok) {
      return alert(
        "Something went wrong when updating the status of your request",
      );
    }

    navigate(-1);
  }

  async function handleDiscard() {
    versionDispatch({ type: ACTION.RESETREVISION });
  }

  const link = null;

  return (
    <div>
      <DocumentsPageLayout pagetitle={`Editing ${document.name}`}>
        <div className="flex flex-col gap-4">
          {/* File Component */}
          <FileBlock
            filename="Untitled.docx"
            isDisabled={true}
            onChange={(event) => {
              console.log("EditDocument.tsx | file:", event);
            }}
            link={version.filePath}
          />
          <div className="grid grid-cols-4 gap-4">
            <DataBlock
              title="Originator"
              value={versionState.originator}
              styling="col-span-2"
              isEditable={
                isEditable && isRoleAllowed(["coordinator"], userRole)
              }
              allowedRoles={["coordinator"]}
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
              title="Revision Date"
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
              title="Approved Date"
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
              text="Submit"
              handleOnClick={handleSubmit}
            />
          </div>
        )}
      </DocumentsPageLayout>
    </div>
  );
}
