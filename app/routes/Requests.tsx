import { useEffect, useReducer, useState } from "react";
import { useRevalidator } from "react-router";
import { useSessionStore } from "stores/sessionStore";
import { Button, DataBlock, DropDownItem, PopUpModal } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import { apiFetch } from "~/utils/apiFetch";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import type { Route } from "./documents/+types/DocumentPage";
import { REVISIONSTATUS, USERROLES } from "~/constants/";

enum ACTION {
  CLICKREQUEST = "CLICKREQUEST",
  /**
   * Include "RESETDATA"
   */
}

type StateType = {
  areButtonsEnabled: boolean;
  isDocumentPanelShown: boolean;
  revision: Partial<RevisionType>;
  document: Partial<DocumentType>;
  user: Partial<UserType>;
};

type ActionType = {
  type: ACTION;
  payload?: {
    revision: RevisionType;
    document: DocumentType;
    user: UserType;
  };
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

type DocumentType = {
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
  user: {
    id: number | null;
    first_name: string;
    last_name: string;
  };
  document: {
    id: number | null;
    name: string;
  };
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

  const fetchedData: RevisionType[] = await response.json();

  const LoadedData: RevisionType[] = fetchedData.map((revision) => {
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

  return LoadedData;
}

export default function Requests({ loaderData }: Route.ComponentProps) {
  /**
   * UI related hooks
   */
  const { revalidate } = useRevalidator();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  /**
   * Data related hooks
   */
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  const initialState = {
    areButtonsEnabled: false,
    revision: {
      id: null,
      title: "",
      reason: "",
      status: REVISIONSTATUS.COORDINATOR,
      user: {
        id: null,
        first_name: "",
        last_name: "",
      },
      document: {
        id: null,
        name: "",
      },
    },
  };

  const revisions: RevisionType[] = loaderData;
  const [state, dispatch] = useReducer(revisionsReducer, initialState);

  useEffect(() => {
    console.log("REVISION:", state.revision);
  }, [state]);

  function revisionsReducer(state: Partial<StateType>, action: ActionType) {
    const { type, payload } = action;
    switch (type) {
      case ACTION.CLICKREQUEST:
        if (!payload) {
          return state;
        }

        const { revision, document, user } = payload;

        return {
          ...state,
          areButtonsEnabled: true,
          revision: {
            id: revision.id,
            title: revision.title,
            reason: revision.reason,
            status: revision.status,
          },
          document: {
            id: document.id,
            name: document.name,
          },
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        };
    }
  }

  /**
   * Functions
   */
  function handleCancel() {
    setTextAreaValue("");
    setIsPopUpVisible(false);
  }

  /*
   * Request DENIED
   */
  // async function handleSubmit() {
  //   if (!revision) {
  //     return alert("No request selected.");
  //   }

  //   const response = await apiFetch(`/revision/${revision.id}`, {
  //     method: "PATCH",
  //     body: JSON.stringify({
  //       status: REVISIONSTATUS.APPROVED,
  //       /**
  //        * NOTE: Add comment
  //        */
  //     }),
  //   });

  //   const data = await response.json();

  //   if (!response.ok) {
  //     alert(data.message);
  //   }

  //   revalidate();
  //   setRevision(null);
  // }

  /**
   * Request APPROVED
   */
  async function handleApprove() {}

  async function handleClickRequest(revision: RevisionType) {
    dispatch({
      type: ACTION.CLICKREQUEST,
      payload: {
        document: revision.document,
        user: revision.user,
        revision: revision,
      },
    });
  }

  /**
   * Page-specific component
   */
  function DocumentDetailsPanel({ title }: { title: string }) {
    return (
      <div className="flex flex-col gap-4 w-full px-4 mb-8">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DataBlock title="Originator" value="None - A" />
          <DataBlock title="Department" value="None - A" />
          <DataBlock title="Revision Number" value="None - A" />
          <DataBlock title="Date" value="None - A" />
          <DataBlock
            title="Revision Details"
            value="None - A"
            styling="col-span-2"
          />
          <DataBlock title="Approver" value="None - A" />
          <DataBlock title="Date" value="None - A" />
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
              {revisions.map((revision) => {
                const { id, title, reason, status, user, document } = revision;

                /*
                 * Shows the originator's requests
                 */
                if (role === USERROLES.ORIGINATOR && userId === user.id) {
                  return (
                    <DropDownItem
                      key={id}
                      title={title}
                      description={reason}
                      status={status}
                      handleOnClick={() => {
                        handleClickRequest(revision);
                        if (document.id) {
                          handleClickRequest(revision);
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
                        if (document.id) {
                          handleClickRequest(revision);
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
                        if (document.id) {
                          handleClickRequest(revision);
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
              {/* {documents && ( */}
              {true && (
                <div className="flex flex-col px-4 w-full gap-4">
                  <div className="flex flex-col">
                    <h1>
                      Request to Revise{" "}
                      {state.document
                        ? state.document?.name
                        : "Unknown Document"}
                    </h1>
                    <p>
                      {state.user
                        ? `${state.user.first_name} ${state.user.last_name}`
                        : "Unknown Author"}
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
                {state.areButtonsEnabled && (
                  <>
                    <Button
                      type={BUTTONTYPES.CANCEL}
                      text="Cancel"
                      handleOnClick={() => {}}
                    />
                    <Button
                      type={BUTTONTYPES.DANGER}
                      text="Deny"
                      handleOnClick={() => {
                        setIsPopUpVisible(true);
                      }}
                    />
                    <Button
                      type={BUTTONTYPES.CONFIRM}
                      text="Approve"
                      handleOnClick={() => {
                        console.log("CLICKED REVISION", state.revision);
                        console.log("RELATED DOCUMENT", state.document);
                      }}
                    />
                  </>
                )}
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
              handleOnClick={() => {}}
              styling="w-full"
            />
          </div>
        </PopUpModal>
      )}
    </div>
  );
}
