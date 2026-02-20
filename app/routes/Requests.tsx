import { useEffect, useReducer, useState } from "react";
import { useSessionStore } from "stores/sessionStore";
import { Button, DataBlock, DropDownItem, PopUpModal } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import { isRoleAllowed, USERROLES } from "~/utils/isRoleAllowed";

enum ACTION {
  ENABLESUBMIT = "ENABLESUBMIT",
  DISABLESUBMIT = "DISABLESUBMIT",
  CANCELUPDATE = "CANCELUPDATE",
}

export const DOCUMENTTYPES = [
  "wastemanagement",
  "hrprocedure",
  "documentcontrol",
] as const;

export const APPROVALSTAGE = [
  "coordinator_approval",
  "superior_approval",
] as const;

type StateTypes = {
  isSubmitEnabled: boolean;
  isInteractable: boolean;
  documentDetails: VersionTypes;
  revisions: RevisionsTypes;
  previousDocumentDetails: VersionTypes | null;
};

type ActionTypes =
  | {
      type: ACTION.ENABLESUBMIT;
      payload: VersionTypes;
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
  approval_stage: (typeof APPROVALSTAGE)[number];
  user_id: number | null;
  document_id: number | null;
  document: Partial<DocumentsType>;
  user: Partial<UsersType>;
};

type DocumentsType = {
  id: number | null;
  type: (typeof DOCUMENTTYPES)[number] | null;
};

type UsersType = {
  id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: (typeof USERROLES)[number];
};

export async function clientLoader() {
  /*
   * NOTE: Check user role if it's allowed.
   */
}

export default function Requests() {
  const initialState: StateTypes = {
    isSubmitEnabled: false,
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
      approval_stage: "coordinator_approval",
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

  const [state, dispatch] = useReducer(revisionsReducer, initialState);

  const [textAreaValue, setTextAreaValue] = useState("");
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [revisions, setRevisions] = useState<RevisionsTypes[]>([]);
  const [documents, setDocuments] = useState<Partial<DocumentsType> | null>(
    null,
  );
  const [users, setUsers] = useState<Partial<UsersType> | null>(null);
  const role = useSessionStore((state) => state.role);

  useEffect(() => {
    fetchRevisions();
  }, []);

  function revisionsReducer(state: StateTypes, action: ActionTypes) {
    switch (action.type) {
      case ACTION.ENABLESUBMIT:
        return {
          ...state,
          previousDocumentDetails: state.documentDetails,
          documentDetails: action.payload,
          isSubmitEnabled: true,
          isInteractable: true,
        };

      case ACTION.CANCELUPDATE:
        return {
          ...state,
          documentDetails: initialState.documentDetails,
          previousDocumentDetails: null,
          isSubmitEnabled: false,
          isInteractable: false,
        };

      default:
        return state;
    }
  }

  async function fetchRevisions() {
    const response = await fetch("http://127.0.0.1/api/revision", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const fetchedRevisions: RevisionsTypes[] = await response.json();
    console.log("FETCHED REVISION DATA:", fetchedRevisions);

    setRevisions(fetchedRevisions);
  }

  function handleCancel() {
    setTextAreaValue("");
    setIsPopUpVisible(false);
  }

  /*
   * Request denied
   */
  async function handleSubmit() {
    const revision_id = state.revisions.id;
    const response = await fetch(
      `http://127.0.0.1/api/revision/${revision_id}`,
      {
        method: "patch",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          status: "denied",
          comments: textAreaValue,
        }),
      },
    );

    console.log("/api/revision/");
  }

  async function handleRevisionOnClick(document_id: number) {
    console.log("DOCUMENT ID:", document_id);
    const response = await fetch("http://127.0.0.1/api/version/latest", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        document_id: document_id,
      }),
    });

    const fetchedVersions = await response.json();

    if (!response.ok) {
      console.log("FAILED", fetchedVersions.message);
      return;
    }

    console.log("FETCHED DOCUMENT:", fetchedVersions);

    if (role === "superior") {
      dispatch({
        type: ACTION.ENABLESUBMIT,
        payload: {
          originator: fetchedVersions.originator,
          department: fetchedVersions.department,
          revisionNumber: fetchedVersions.revisionNumber,
          revisionDetails: fetchedVersions.revisionDetails,
          dateRevised: fetchedVersions.revisionDate,
          approver: fetchedVersions.approver,
          dateApproved: fetchedVersions.approvedDate,
        },
      });
    }
  }

  function SuperiorDocumentDetailsPanel() {
    return (
      <>
        <div className="w-full px-4">
          <div>
            <h1 className="">Document Details</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full justify-around py-4">
            <DataBlock
              title="Originator"
              value={state.documentDetails.originator}
            />
            <DataBlock
              title="Department"
              value={state.documentDetails.department}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full justify-around py-4">
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
          </div>
          <div className="grid grid-cols-2 gap-4 w-full justify-around py-4">
            <DataBlock
              title="Approver"
              value={state.documentDetails.approver}
            />
            <DataBlock
              title="Date"
              value={state.documentDetails.dateApproved}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full px-4 py-4 gap-2">
        <div className="flex gap-8 h-full ">
          {/* Revisions Panel */}
          <div className="flex flex-col w-2/5 h-full">
            <h1 className="mb-2">Requests</h1>
            <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
              {revisions.map((item) => {
                if (
                  item.approval_stage === APPROVALSTAGE[0] &&
                  role === USERROLES[2]
                ) {
                  console.log("COORDINATOR:", item.approval_stage);
                  return (
                    <DropDownItem
                      key={item.id}
                      title={item.title}
                      description={item.reason}
                      handleOnClick={() => {
                        if (item.document_id) {
                          setUsers(item.user);
                          setDocuments(item.document);
                          handleRevisionOnClick(item.document_id);
                        }
                      }}
                      handleDeny={() => setIsPopUpVisible(true)}
                    />
                  );
                }

                if (
                  item.approval_stage === APPROVALSTAGE[1] &&
                  role === USERROLES[3]
                ) {
                  console.log("SUPERIOR:", item.approval_stage);
                  return (
                    <DropDownItem
                      key={item.id}
                      title={item.title}
                      description={item.reason}
                      handleOnClick={() => {
                        if (item.document_id) {
                          setUsers(item.user);
                          handleRevisionOnClick(item.document_id);
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
          <div className="flex flex-col justify-between w-full px-4 border-l border-slate-300">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col px-4 w-full gap-4">
                <div className="flex flex-col">
                  <h1>
                    Request to Revise{" "}
                    {documents === null ? "Unknown Document" : documents.type}
                  </h1>
                  <p>
                    {users === null
                      ? "Unknown Author"
                      : users.first_name + " " + users.last_name}
                  </p>
                </div>
                <div className="flex flex-col gap-4 items-center justify-between w-full h-fit p-4 rounded-lg border border-slate-300 bg-slate-50">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col bg-slate-50 rounded-lg">
                      <h2 className="text-gray-500">Reason title</h2>
                      <p className="text-gray-500">Reason description</p>
                    </div>
                  </div>
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
              {isRoleAllowed(["superior"], role) && (
                <SuperiorDocumentDetailsPanel />
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
                  handleOnClick={() => {}}
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
