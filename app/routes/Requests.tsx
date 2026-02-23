import { useEffect, useReducer, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { Button, DataBlock, DropDownItem, PopUpModal } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import { apiFetch } from "~/utils/apiFetch";
import { isRoleAllowed, USERROLES } from "~/utils/isRoleAllowed";

enum ACTION {
  CLICKREQUEST = "CLICKREQUEST",
  APPROVEREQUEST = "APPROVEREQUEST",
  DENYREQUEST = "DENYREQUEST",
  CANCELUPDATE = "CANCELUPDATE",
  DISABLEBUTTONS = "DIABLEBUTTONS",
  ENABLEBUTTONS = "ENABLEBUTTONS",
  FETCHDATA = "FETCHDATA",
  // old ACTIONs
  ENABLEAPPROVE = "ENABLEAPPROVE",
  DISABLESUBMIT = "DISABLESUBMIT",
}

export enum DOCUMENTTYPES {
  WASTEMANAGEMENT = "wastemanagement",
  HRPROCEDURE = "hrprocedure",
  DOCUMENTCONTROL = "documentcontrol",
}

export enum APPROVALSTAGE {
  COORDINATOR = "coordinator_approval",
  SUPERIOR = "superior_approval",
}

export enum REVISIONSTATUS {
  COORDINATOR = "coordinator_approval",
  SUPERIOR = "superior_approval",
  APPROVED = "approved",
  DENIED = "denied",
}

type StateTypes = {
  isApproveEnabled: boolean;
  isInteractable: boolean;
  documentDetails: VersionTypes;
  revisions: RevisionsTypes;
  previousDocumentDetails: VersionTypes | null;
};

type ActionTypes =
  | { type: ACTION.APPROVEREQUEST; payload: VersionTypes }
  | {
      type: ACTION.ENABLEAPPROVE;
    }
  | {
      type: ACTION.CANCELUPDATE;
    };

type VersionTypes = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  dateRevised: string;
  approver: string;
  dateApproved: string;
};

type RevisionsTypes = {
  id: number | null;
  title: string;
  reason: string;
  approval_stage: APPROVALSTAGE;
  status: REVISIONSTATUS;
  user_id: number | null;
  document_id: number | null;
  document: Partial<DocumentsType>;
  user: Partial<UsersType>;
  // comment: string;
};

type DocumentsType = {
  id: number | null;
  name: string;
  type: DOCUMENTTYPES | null;
};

type UsersType = {
  id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: USERROLES;
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

  const fetchedRevisions: RevisionsTypes[] = await response.json();
  console.log("FETCHED REVISION DATA:", fetchedRevisions);

  const requestsData = fetchedRevisions.map((item) => {
    const { document, user } = item;

    return {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      document: {
        id: document.id,
        name: document.name,
      },
    };
  });

  return fetchedRevisions;
}

export default function Requests() {
  const initialState: StateTypes = {
    isApproveEnabled: false,
    isInteractable: false,
    documentDetails: {
      originator: "None",
      department: "None",
      revisionNumber: "None",
      revisionDetails: "None",
      dateRevised: "None",
      approver: "None",
      dateApproved: "None",
    },
    revisions: {
      id: null,
      title: "None",
      reason: "None",
      approval_stage: APPROVALSTAGE.COORDINATOR,
      status: REVISIONSTATUS.COORDINATOR,
      user_id: null,
      document_id: null,
      document: {
        id: null,
        type: null,
      },
      user: {
        id: null,
        first_name: "",
        last_name: "",
      },
    },
    previousDocumentDetails: null,
  };

  const fetchedRevisions = useLoaderData<RevisionsTypes[] | []>();

  const [state, dispatch] = useReducer(revisionsReducer, initialState);
  const { revalidate } = useRevalidator();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  /**
   * Single revision object: revision
   */
  const [revision, setRevision] = useState<RevisionsTypes | null>(null);
  const [documents, setDocuments] = useState<Partial<DocumentsType> | null>(
    null,
  );
  const [users, setUsers] = useState<Partial<UsersType> | null>(null);
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  function revisionsReducer(state: StateTypes, action: ActionTypes) {
    switch (action.type) {
      case ACTION.APPROVEREQUEST:
        return {
          ...state,
          previousDocumentDetails: state.documentDetails,
          documentDetails: action.payload,
          isApproveEnabled: true,
          isInteractable: true,
        };

      case ACTION.CANCELUPDATE:
        return {
          ...state,
          documentDetails: initialState.documentDetails,
          previousDocumentDetails: null,
          isApproveEnabled: false,
          isInteractable: false,
        };

      case ACTION.ENABLEAPPROVE:
        return {
          ...state,
          isInteractable: true,
          isApproveEnabled: true,
        };

      default:
        return state;
    }
  }

  function handleCancel() {
    setTextAreaValue("");
    setIsPopUpVisible(false);
  }

  /*
   * Request DENIED
   */
  async function handleSubmit() {
    if (!revision) {
      return alert("No request selected.");
    }

    const response = await apiFetch(`/revision/${revision.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: REVISIONSTATUS.APPROVED,
        /**
         * NOTE: Add comment
         */
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
    }

    revalidate();
    setRevision(null);
  }

  /**
   * Request APPROVED
   */
  async function handleApprove() {
    if (!revision) {
      return alert("No request selected.");
    }

    if (revision.status === REVISIONSTATUS.COORDINATOR) {
    }

    const newStatus =
      revision.status === REVISIONSTATUS.SUPERIOR
        ? REVISIONSTATUS.APPROVED
        : revision.status === REVISIONSTATUS.COORDINATOR
          ? REVISIONSTATUS.SUPERIOR
          : REVISIONSTATUS.COORDINATOR;

    const response = await apiFetch(`/revision/${revision.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
    }

    revalidate();
    setRevision(null);
  }

  async function handleClickRequest() {
    const response = await apiFetch("/version/latest", {
      method: "GET",
      body: JSON.stringify({
        document_id: 3,
      }),
    });
  }

  // async function handleRevisionOnClick(revision: RevisionsTypes) {
  //   if (!revision) {
  //     return alert("Revision is null");
  //   }

  //   const { user, document, document_id } = revision;

  //   setUsers(user);
  //   setDocuments(document);
  //   setRevision(revision);
  //   console.log("DOCUMENT ID:", document_id);

  //   const response = await apiFetch("/version/latest", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       document_id: document_id,
  //     }),
  //   });

  //   const latestVersion = await response.json();

  //   if (!response.ok) {
  //     console.log("FAILED", latestVersion.message);
  //     return;
  //   }

  //   const {
  //     originator,
  //     department,
  //     revisionNumber,
  //     revisionDetails,
  //     revisionDate,
  //     approver,
  //     approvedDate,
  //   } = latestVersion;

  //   console.log("Document Details:", latestVersion);

  //   if (role === "superior" && fetchedRevisions.length === 0) {
  //     dispatch({
  //       type: ACTION.CLICKREQUEST,
  //       payload: {
  //         ...latestVersion,
  //       },
  //     });
  //   }

  //   dispatch({
  //     type: ACTION.ENABLEAPPROVE,
  //   });
  // }

  function DocumentDetailsPanel({ title }: { title: string }) {
    return (
      <div className="flex flex-col gap-4 w-full px-4 mb-8">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DataBlock
            title="Originator"
            value={state.documentDetails.originator}
          />
          <DataBlock
            title="Department"
            value={state.documentDetails.department}
          />
          <DataBlock
            title="Revision Number"
            value={state.documentDetails.revisionNumber}
          />
          <DataBlock title="Date" value={state.documentDetails.dateRevised} />
          <DataBlock
            title="Revision Details"
            value={state.documentDetails.revisionDetails}
            styling="col-span-2"
          />
          <DataBlock title="Approver" value={state.documentDetails.approver} />
          <DataBlock title="Date" value={state.documentDetails.dateApproved} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full px-4 py-4 gap-2">
        <div className="flex h-full ">
          {/* Revisions Panel */}
          <div className="flex flex-col w-1/3 h-full mr-8">
            <h1 className="mb-2">Requests</h1>
            <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
              {fetchedRevisions.map((item) => {
                /*
                 * Shows the originator's requests
                 */
                const {
                  id,
                  title,
                  reason,
                  approval_stage,
                  status,
                  document_id,
                  user,
                } = item;

                if (role === USERROLES.ORIGINATOR && userId === user.id) {
                  console.log("ORIGINATOR:", approval_stage);
                  return (
                    <DropDownItem
                      key={id}
                      title={title}
                      description={reason}
                      status={status}
                      handleOnClick={() => {
                        if (document_id) {
                          // handleRevisionOnClick(item);
                        }
                      }}
                      handleDeny={() => setIsPopUpVisible(true)}
                    />
                  );
                }

                /*
                 * Shows all pending requests that are
                 * for coordinator approval
                 */
                if (
                  status === REVISIONSTATUS.COORDINATOR &&
                  role === USERROLES.COORDINATOR
                ) {
                  // console.log("COORDINATOR:", revision);
                  return (
                    <DropDownItem
                      key={id}
                      title={title}
                      description={reason}
                      status={status}
                      handleOnClick={() => {
                        if (document_id) {
                          // handleRevisionOnClick(item);
                        }
                      }}
                      handleDeny={() => setIsPopUpVisible(true)}
                    />
                  );
                }

                /*
                 * Shows all pending requests that are
                 * for superior approval
                 */
                if (
                  status === REVISIONSTATUS.SUPERIOR &&
                  role === USERROLES.SUPERIOR
                ) {
                  // console.log("SUPERIOR:", approval_stage);
                  return (
                    <DropDownItem
                      key={id}
                      title={title}
                      description={reason}
                      status={status}
                      handleOnClick={() => {
                        if (document_id) {
                          // handleRevisionOnClick(item);
                        }
                      }}
                      handleDeny={() => setIsPopUpVisible(true)}
                    />
                  );
                }
              })}
            </ul>
          </div>
          {/* Document Details Panel */}
          <div className="flex flex-col justify-between flex-1 px-4 border-l border-slate-300">
            <div className="flex flex-col gap-4 overflow-y-scroll">
              {documents && (
                <div className="flex flex-col px-4 w-full gap-4">
                  <div className="flex flex-col">
                    <h1>
                      Request to Revise{" "}
                      {documents === null ? "Unknown Document" : documents.name}
                    </h1>
                    <p>
                      {users === null
                        ? "Unknown Author"
                        : users.first_name + " " + users.last_name}
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
              )}
              {isRoleAllowed(["superior"], role) && (
                <DocumentDetailsPanel title="Document Details" />
              )}
            </div>
            {isRoleAllowed(["coordinator", "superior"], role) && (
              <div className="flex w-full justify-end gap-2">
                {state.isInteractable && (
                  <>
                    <Button
                      type={
                        state.isInteractable
                          ? BUTTONTYPES.CANCEL
                          : BUTTONTYPES.DISABLED
                      }
                      text="Cancel"
                      handleOnClick={() => {
                        dispatch({
                          type: ACTION.CANCELUPDATE,
                        });
                      }}
                    />
                    <Button
                      type={
                        state.isInteractable
                          ? BUTTONTYPES.DANGER
                          : BUTTONTYPES.DISABLED
                      }
                      text="Deny"
                      handleOnClick={() => {
                        setIsPopUpVisible(true);
                        dispatch({
                          type: ACTION.CANCELUPDATE,
                        });
                      }}
                    />
                  </>
                )}
                <Button
                  type={
                    state.isInteractable
                      ? BUTTONTYPES.CONFIRM
                      : BUTTONTYPES.DISABLED
                  }
                  text="Approve"
                  handleOnClick={handleApprove}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isPopUpVisible && (
        <PopUpModal onClose={() => {}}>
          <h2 className="text-gray-500">Comment</h2>
          <div className="border border-l-slate-300 border-y-0 border-r-0">
            <textarea
              placeholder="Write a comment..."
              className="w-full resize-y min-h-48 outline-none pl-4"
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
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
