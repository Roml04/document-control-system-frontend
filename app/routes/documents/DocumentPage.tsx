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
  const apiResponse = await apiFetch(`/document/${params.documentId}`, {
    method: "GET",
  });

  if (!apiResponse.ok) {
    alert(apiResponse.message);
  }

  console.log("apiResponse:", apiResponse);

  return apiResponse.data;
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
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);
  const documentVersion = loaderData;

  console.log("LOADER", documentVersion);

  return (
    <div>
      <DocumentsPageLayout pagetitle="value">
        <div className="flex flex-col my-4 gap-4">
          {/* File Component */}
          <FileBlock
            filename={null}
            link={null}
            isDisabled={false}
            canUpload={true}
          />

          <div className="grid grid-cols-4 gap-4">
            <DataBlock title="Originator" value="value" styling="col-span-2" />
            <DataBlock title="Department" value="value" styling="col-span-2" />
            <DataBlock
              title="Revision Number"
              value="value"
              styling="col-span-2"
            />
            <DataBlock title="Date" value="value" styling="col-span-2" />
            <DataBlock
              title="Revision Details"
              value="value"
              styling="col-span-4"
            />
            <DataBlock title="Approver" value="value" styling="col-span-2" />
            <DataBlock title="Date" value="value" styling="col-span-2" />
          </div>
        </div>
        {isRoleAllowed(["originator", "coordinator"], role) && (
          <div className="flex w-full justify-end gap-2">
            <button
              onClick={() => {}}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Revision
            </button>
            <button
              onClick={() => {}}
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
              value="hello"
              placeholder="Title"
              className="resize-y outline-none text-xl font-bold"
              onChange={() => {}}
            />
            <textarea
              className="resize-y min-h-32 outline-none"
              value="hello"
              placeholder="Reason for revision..."
              onChange={() => {}}
            />
          </div>
          <div className="flex w-full justify-between gap-2">
            <Button
              type={BUTTONTYPES.CANCEL}
              text="Cancel"
              handleOnClick={() => {}}
              styling="w-full"
            />
            <Button
              type={BUTTONTYPES.CONFIRM}
              text="Submit"
              handleOnClick={() => {}}
              styling="w-full"
            />
          </div>
        </PopUpModal>
      )}
    </div>
  );
}
