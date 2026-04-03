import { useEffect, useReducer, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { Button, DataBlock, DropDownItem, PopUpModal } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import { apiFetch } from "~/utils/apiFetch";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { REVISIONSTATUS } from "~/constants/";
import type { Route } from "./+types/Requests";
import { changeStatus } from "~/utils/changeStatus";
import FileBlock from "~/components/ui/FileBlock";
import { VERSIONSTATUS } from "~/constants/versionStatus.enum";
import type { RevisionType } from "~/constants/types";

enum ACTION {
  CLICKREQUEST = "CLICKREQUEST",
  RESETDATA = "RESETDATA",
  SHOWDOCUMENT = "SHOWDOCUMENT",
  SHOWFILE = "SHOWFILE",
}

type StateType = {
  areButtonsEnabled: boolean;
  isDocumentPanelShown: boolean;
  revision: RevisionType;
  document: DocumentType;
  user: UserType;
  version: VersionType;
};

type ActionType =
  | { type: ACTION.CLICKREQUEST; payload: Partial<StateType> }
  | { type: ACTION.RESETDATA }
  | { type: ACTION.SHOWDOCUMENT; payload: Partial<StateType> }
  | { type: ACTION.SHOWFILE; payload: Partial<StateType> };

type VersionType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
  filePath: string | null;
  fileName: string;
};

export type DocumentType = {
  id: number | null;
  name: string;
};

type UserType = {
  id: number | null;
  first_name: string;
  last_name: string;
};

export type FetchedRevisionType = {
  id: number | null;
  title: string;
  reason: string;
  status: REVISIONSTATUS;
  user: UserType;
  document: DocumentType;
  version?: VersionType;
  comment: string;
};

export async function clientLoader() {
  /*
   * NOTE: Check user role if it's allowed.
   */

  /**
   * Index revisions alongside users (id, first_name, & last_name) and documents (id, name)
   * If role === superior, fetch latest version of document
   */
  const session = useSessionStore.getState();

  const revisions = await apiFetch("/revision", {
    method: "POST",
    body: JSON.stringify({
      role: session.role,
    }),
  });

  console.log("Requests.tsx | /revision", revisions);

  return revisions.data;
}

export default function Requests({ loaderData }: Route.ComponentProps) {
  /**
   * UI related hooks
   */
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const [commentValue, setCommentValue] = useState("");
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  /**
   * Data related hooks
   */
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  const revisions: RevisionType[] = loaderData;

  /**
   * Functions
   */

  async function fetchDocumentDetails(documentId: number) {
    const response = await apiFetch(`/version/pending/${documentId}`, {
      method: "POST",
    });

    const documentVersion = await response.json();

    // dispatch
  }

  function handlePopUpCancel() {
    setCommentValue("");
    setIsPopUpVisible(false);
  }

  /**
   * Request APPROVED
   */
  async function handleApprove() {
    revalidate();
  }

  /**
   * Request DENIED
   */
  async function handleDeny(revisionId: number) {
    revalidate();
  }

  async function handleClickRequest(revision: FetchedRevisionType) {}

  /**
   * Page-specific component
   */
  function DocumentDetailsPanel() {
    return (
      <div className="flex flex-col gap-4 w-full px-4 mb-8">
        <div>
          <h1>Document Details</h1>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DataBlock title="Originator" value="test" />
          <DataBlock title="Department" value="test" />
          <DataBlock title="Revision Number" value="test" />
          <DataBlock title="Date" value="test" />
          <DataBlock
            title="Revision Details"
            value="test"
            styling="col-span-2"
          />
          <DataBlock title="Approver" value="test" />
          <DataBlock title="Date" value="test" />
        </div>
      </div>
    );
  }

  function RevisionDetailsPanel() {
    return (
      <div className="flex flex-col justify-between flex-1 px-4 border-l border-slate-300">
        <div className="flex flex-col gap-4 h-full overflow-y-scroll">
          <div className="flex flex-col px-4 w-full gap-4">
            <div className="flex flex-col">
              <h1>{false ? "Document" : "Unknown Document"}</h1>
              <div className="flex flex-col border-b border-slate-300 py-4 gap-2">
                <div className="grid grid-cols-12 gap-y-2">
                  <h3 className="col-span-2 pr-4">Author</h3>
                  <p className="col-span-10 px-4">{`User`}</p>
                  <h3 className="col-span-2 pr-4">Reason</h3>
                  <p className="col-span-10 px-4 line-clamp-3">{}</p>
                </div>
              </div>
              {true && (
                <div className="w-full col-span-12 flex flex-col gap-1 rounded-lg bg-slate-50 border border-slate-300 p-4 mt-4">
                  <h3>Comment</h3>
                  <p className="border-l border-slate-300 px-4 ml-2 line-clamp-3">
                    {}
                  </p>
                </div>
              )}
            </div>
            {/* File Component */}
          </div>
          {isRoleAllowed(["superior"], role) ? <DocumentDetailsPanel /> : null}
        </div>
        {isRoleAllowed(["coordinator", "superior"], role) && (
          <div className="flex w-full justify-end gap-2">
            {true && (
              <>
                <Button
                  type={BUTTONTYPES.CANCEL}
                  text="Cancel"
                  handleOnClick={() => {}}
                  isEnabled={isRoleAllowed(["coordinator", "superior"], role)}
                />
                <Button
                  type={BUTTONTYPES.DANGER}
                  text="Deny"
                  handleOnClick={() => {
                    setIsPopUpVisible(true);
                  }}
                  isEnabled={isRoleAllowed(["coordinator", "superior"], role)}
                />
                <Button
                  type={BUTTONTYPES.CONFIRM}
                  text="Approve"
                  handleOnClick={() => {
                    handleApprove();
                  }}
                  isEnabled={isRoleAllowed(["coordinator", "superior"], role)}
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full px-4 py-4 gap-2">
        <div className="flex h-full ">
          {/* Revisions Panel */}
          {revisions.length !== 0 ? (
            <>
              <div className="flex flex-col w-1/3 h-full mr-8">
                <h1 className="mb-2">Requests</h1>
                <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
                  {revisions.map((revision) => {
                    return <li>Hello</li>;
                  })}
                </ul>
              </div>
              {false ? (
                <RevisionDetailsPanel />
              ) : (
                <div className="border-l border-slate-300 flex flex-1 w-full h-full justify-center items-center">
                  <h2 className="text-slate-400">No request selected</h2>
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full h-full justify-center items-center">
              <h2 className="text-slate-400">No items to process</h2>
            </div>
          )}
          {/* Revision Details Panel */}
        </div>
      </div>
      {isPopUpVisible && (
        <PopUpModal onClose={() => {}}>
          <h2 className="text-gray-500">Comment</h2>
          <div className="border border-l-slate-300 border-y-0 border-r-0">
            <textarea
              placeholder="Write a comment..."
              className="w-full resize-y min-h-48 outline-none pl-4"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-between gap-2">
            <Button
              type={BUTTONTYPES.CANCEL}
              text="Cancel"
              handleOnClick={handlePopUpCancel}
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
