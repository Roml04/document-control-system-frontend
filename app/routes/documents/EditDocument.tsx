import { useEffect, useReducer, useState } from "react";
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

type VersionStateType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
};

type RevisionActionType =
  | { type: ACTION.SETREVISION; payload: Partial<VersionStateType> }
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

  const { revision, version, document } = responseBody;

  return {
    version: {
      id: version.id,
      originator: version.originator,
      department: version.department,
      revisionNumber: version.revisionNumber,
      revisionDetails: version.revisionDetails,
      revisionDate: version.revisionDate,
      approver: version.approver,
      approvedDate: version.approvedDate,
      documentId: version.documentId,
      filePath: version.filePath,
      fileName: version.fileName,
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

  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);

  if (!loaderData) {
    throw new Error("No data loaded");
  }

  const { version, revision, document: documentData } = loaderData;
  // const { version, revision, document } = loaderData;

  const isEditable =
    isRoleAllowed(["originator", "coordinator"], userRole) &&
    revision.status === REVISIONSTATUS.ORIGINATOR;

  const documentExists = version.id && documentData.id;

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
    versionDispatch({
      type: ACTION.SETREVISION,
      payload: versionInitState,
    });
  }, [version]);

  function versionReducer(state: VersionStateType, action: RevisionActionType) {
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
    const formData = new FormData();

    formData.append("originator", versionState.originator);
    formData.append("department", versionState.department);
    formData.append("revisionNumber", versionState.revisionNumber);
    formData.append("revisionDate", versionState.revisionDate);
    formData.append("revisionDetails", versionState.revisionDetails);
    formData.append("approver", versionState.approver);
    formData.append("approvedDate", versionState.approvedDate);
    formData.append("revisionId", String(revision.id));
    formData.append("documentId", String(documentData.id));
    formData.append("status", VERSIONSTATUS.PENDING);

    if (file) {
      formData.append("file", file);
      formData.append("fileName", file.name);
    } else if (removeFile) {
      formData.append("fileName", "");
      formData.append("filePath", "");
    } else {
      formData.append("fileName", version.fileName);
      formData.append("filePath", version.filePath);
    }

    const versionResponse = await apiFetch(`/version`, {
      method: "POST",
      body: formData,
    });

    const data = await versionResponse.json();

    if (!versionResponse.ok) {
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

  function handleDiscard() {
    versionDispatch({ type: ACTION.RESETREVISION });
    setFile(null);
    setRemoveFile(false);
  }

  const displayedFilename = file
    ? file.name
    : removeFile
      ? ""
      : version.fileName;

  const displayedLink = removeFile ? null : version.filePath;

  return (
    <div>
      <DocumentsPageLayout pagetitle={`Editing ${documentData.name}`}>
        <div className="flex flex-col gap-4">
          <FileBlock
            filename={displayedFilename}
            link={displayedLink}
            isDisabled={!isEditable}
            canUpload={true}
            onChange={(uploadedFile) => {
              setFile(uploadedFile);
              setRemoveFile(false);
            }}
            onEditClick={() => {
              document.getElementById("fileInput")?.click();
            }}
            onRemove={() => {
              setFile(null);
              setRemoveFile(true);
            }}
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
      </DocumentsPageLayout>
    </div>
  );
}
