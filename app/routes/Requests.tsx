import { useEffect, useReducer, useState } from "react";
import { useRevalidator } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { Button, DataBlock, DropDownItem, PopUpModal } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import { apiFetch } from "~/utils/apiFetch";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import { REVISIONSTATUS, USERROLE } from "~/constants/";
import type { Route } from "./+types/Requests";
import { changeStatus } from "~/utils/changeStatus";

enum ACTION {
  CLICKREQUEST = "CLICKREQUEST",
  RESETDATA = "RESETDATA",
  SHOWDOCUMENT = "SHOWDOCUMENT",
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
  | { type: ACTION.SHOWDOCUMENT; payload: Partial<StateType> };

type VersionType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
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

type RevisionType = {
  id: number | null;
  title: string;
  reason: string;
  status: REVISIONSTATUS;
};

type FetchedRevisionType = {
  id: number | null;
  title: string;
  reason: string;
  status: REVISIONSTATUS;
  user: UserType;
  document: DocumentType;
  version?: VersionType;
};

export async function clientLoader() {
  /*
   * NOTE: Check user role if it's allowed.
   */

  /**
   * Index revisions alongside users (id, first_name, & last_name) and documents (id, name)
   * If role === superior, fetch latest version of document
   */
  const response = await apiFetch("/revision", {
    method: "GET",
  });

  const data: FetchedRevisionType[] = await response.json();

  const responseBody: FetchedRevisionType[] = data.map((revision) => {
    const { document, user } = revision;

    return {
      id: revision.id ?? null,
      title: revision.title,
      reason: revision.reason,
      status: revision.status,
      user: {
        id: user.id ?? null,
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
      },
      document: {
        id: document.id ?? null,
        name: document.name ?? "",
      },
    };
  });

  return responseBody;
}

export default function Requests({ loaderData }: Route.ComponentProps) {
  /**
   * UI related hooks
   */
  const { revalidate } = useRevalidator();
  const [commentValue, setCommentValue] = useState("");
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  /**
   * Data related hooks
   */
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  const initialState = {
    areButtonsEnabled: false,
    isDocumentPanelShown: false,
    revision: {
      id: null,
      title: "Untitled",
      reason: "No reasons provided...",
      status: REVISIONSTATUS.COORDINATOR,
    },
    document: {
      id: null,
      name: "Unknown Document",
    },
    user: {
      id: null,
      first_name: "Unknown",
      last_name: "User",
    },
    version: {
      originator: "None",
      department: "None",
      revisionNumber: "None",
      revisionDetails: "None",
      revisionDate: "None",
      approver: "None",
      approvedDate: "None",
    },
  };

  const revisions = loaderData;

  const filteredRevisions = revisions.filter((revision) => {
    switch (role) {
      case USERROLE.ORIGINATOR:
        return (
          revision.status === REVISIONSTATUS.ORIGINATOR ||
          userId === revision.user.id
        );

      case USERROLE.COORDINATOR:
        return (
          revision.status === REVISIONSTATUS.COORDINATOR ||
          userId === revision.user.id
        );

      case USERROLE.SUPERIOR:
        return revision.status === REVISIONSTATUS.SUPERIOR;

      default:
        return false;
    }
  });

  const [state, dispatch] = useReducer(revisionsReducer, initialState);

  useEffect(() => {
    console.log("state:", state);
    console.log("revision:", filteredRevisions);
  }, [state, filteredRevisions]);

  /**
   * Functions
   */
  function revisionsReducer(state: StateType, action: ActionType) {
    switch (action.type) {
      case ACTION.CLICKREQUEST:
        return {
          ...state,
          ...action.payload,
        };

      case ACTION.SHOWDOCUMENT:
        return {
          ...state,
          version: action.payload.version ?? initialState.version,
        };

      case ACTION.RESETDATA:
        return initialState;

      default:
        return state;
    }
  }

  async function fetchDocumentDetails(documentId: number) {
    const response = await apiFetch(`/document/${documentId}`, {
      method: "GET",
    });

    const responseBody = await response.json();
    const documentVersion = responseBody.data;

    dispatch({
      type: ACTION.SHOWDOCUMENT,
      payload: {
        version: {
          ...documentVersion,
        },
      },
    });
  }

  function handlePopUpCancel() {
    setCommentValue("");
    setIsPopUpVisible(false);
  }

  /**
   * Request APPROVED
   */
  async function handleApprove() {
    if (!state.revision) {
      return alert("No request selected");
    }

    if (state.revision.status === REVISIONSTATUS.DENIED) {
      return alert("You are trying to approve a denied request");
    }

    await apiFetch(`/revision/${state.revision.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: changeStatus(state.revision.status),
      }),
    });
    dispatch({ type: ACTION.RESETDATA });

    revalidate();
  }

  /**
   * Request DENIED
   */
  async function handleDeny(revisionId: number) {
    const response = await apiFetch(`/revision/${revisionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: REVISIONSTATUS.DENIED,
        comment: commentValue,
      }),
    });

    if (!response.ok) {
      return alert("Something went wrong.");
    }
    setCommentValue("");

    revalidate();
  }

  async function handleClickRequest(revision: FetchedRevisionType) {
    dispatch({
      type: ACTION.CLICKREQUEST,
      payload: {
        areButtonsEnabled: true,
        document: revision.document,
        user: revision.user,
        revision: revision,
      },
    });

    if (isRoleAllowed(["superior"], role) && revision.document.id) {
      fetchDocumentDetails(revision.document.id);
    }
  }

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
          <DataBlock
            title="Originator"
            value={state.version.originator}
            isEditable={isRoleAllowed(["originator"], role)}
          />
          <DataBlock
            title="Department"
            value={state.version.department}
            isEditable={isRoleAllowed(["originator"], role)}
          />
          <DataBlock
            title="Revision Number"
            value={state.version.revisionNumber}
            isEditable={isRoleAllowed(["originator"], role)}
          />
          <DataBlock
            title="Date"
            value={state.version.revisionDate}
            isEditable={isRoleAllowed(["originator"], role)}
          />
          <DataBlock
            title="Revision Details"
            value={state.version.revisionDetails}
            styling="col-span-2"
            isEditable={isRoleAllowed(["originator"], role)}
          />
          <DataBlock
            title="Approver"
            value={state.version.approver}
            isEditable={isRoleAllowed(["originator"], role)}
          />
          <DataBlock
            title="Date"
            value={state.version.approvedDate}
            isEditable={isRoleAllowed(["originator"], role)}
          />
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
              <h1>
                {state.document ? state.document.name : "Unknown Document"}
              </h1>
              <p>
                {state.user
                  ? state.user.first_name + " " + state.user.last_name
                  : "Unknown User"}
              </p>
            </div>
            <div className="flex flex-col gap-4 items-center justify-between w-full h-fit p-4 rounded-lg border border-slate-300 bg-slate-50">
              {/* File Component */}
              <div className="flex items-center w-full justify-between gap-3">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-slate-200 text-slate-600"></div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500">File</span>
                    <span className="font-medium text-gray-500">
                      waste-management.docx
                    </span>
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
          </div>
          {isRoleAllowed(["superior"], role) ||
          (state.revision.status === REVISIONSTATUS.ORIGINATOR &&
            isRoleAllowed(["originator"], role)) ? (
            <DocumentDetailsPanel />
          ) : null}
        </div>
        {isRoleAllowed(["coordinator", "superior"], role) && (
          <div className="flex w-full justify-end gap-2">
            {state.areButtonsEnabled && (
              <>
                <Button
                  type={BUTTONTYPES.CANCEL}
                  text="Cancel"
                  handleOnClick={() => {
                    dispatch({ type: ACTION.RESETDATA });
                  }}
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
          {filteredRevisions.length !== 0 ? (
            <>
              <div className="flex flex-col w-1/3 h-full mr-8">
                <h1 className="mb-2">Requests</h1>
                <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
                  {filteredRevisions.map((revision) => {
                    const { id, title, reason, status, document } = revision;
                    return (
                      <DropDownItem
                        key={id}
                        title={title}
                        description={reason}
                        status={status}
                        handleOnClick={() => {
                          if (document.id) {
                            handleClickRequest(revision);
                          }
                        }}
                      />
                    );
                  })}
                </ul>
              </div>
              {state.document.id ? (
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
              handleOnClick={() => {
                if (state.revision.id) {
                  handleDeny(state.revision.id);
                  setIsPopUpVisible(false);
                }
              }}
              styling="w-full"
            />
          </div>
        </PopUpModal>
      )}
    </div>
  );
}
