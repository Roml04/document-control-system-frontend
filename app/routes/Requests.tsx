import { useEffect, useReducer, useState } from "react";
import { useSessionStore } from "stores/sessionStore";
import {
  PressableIcon,
  DataBlock,
  DropDownItem,
  PopUpModal,
} from "~/components";

enum ACTION {
  ENABLESUBMIT = "ENABLESUBMIT",
  DISABLESUBMIT = "DISABLESUBMIT",
  CANCELUPDATE = "CANCELUPDATE",
}

type StateTypes = {
  isSubmitEnabled: boolean;
  isInteractable: boolean;
  documentDetails: DocumentDataTypes;
  previousDocumentDetails: DocumentDataTypes | null;
};

type ActionTypes =
  | {
      type: ACTION.ENABLESUBMIT;
      payload: DocumentDataTypes;
    }
  | {
      type: ACTION.CANCELUPDATE;
    };

type DocumentDataTypes = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  dateCreated: string;
  approver: string;
  dateApproved: string;
};

type RevisionsTypes = {
  id: number;
  title: string;
  reason: string;
  user_id: number;
  document_id: number;
}[];

export async function clientLoader() {
  return;
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
      dateCreated: "None",
      approver: "None",
      dateApproved: "None",
    },
    previousDocumentDetails: null,
  };

  const [state, dispatch] = useReducer(revisionsReducer, initialState);

  const [textAreaValue, setTextAreaValue] = useState("");
  const [isPopUpVisible, setisPopUpVisible] = useState(false);
  const [revisions, setRevisions] = useState<RevisionsTypes>([]);
  const token = useSessionStore((state) => state.role);

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
          documentDetails:
            state.previousDocumentDetails ?? state.documentDetails,
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
        Authorization: `Bearer ${token}`,
      },
    });

    const data: RevisionsTypes = await response.json();
    console.log("DATA:", data);

    setRevisions(data);
  }

  function handleCancel() {
    setTextAreaValue("");
    setisPopUpVisible(false);
  }

  function handleSubmit() {}

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full px-4 py-4 gap-2">
        <div className="flex gap-8 h-full ">
          {/* Revisions Panel */}
          <div className="flex flex-col w-3/4 h-full">
            <h1 className="mb-2">Requests</h1>
            <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
              {revisions.map((item) => (
                <DropDownItem
                  key={item.id}
                  title={item.title}
                  description={item.reason}
                  handleApprove={() => {
                    dispatch({
                      type: ACTION.ENABLESUBMIT,
                      payload: {
                        originator: "Juan Dela Cruz",
                        department: "HR Department",
                        revisionNumber: "Rev-002",
                        revisionDetails: "None",
                        dateCreated: "2026-02-02",
                        approver: "John Doe",
                        dateApproved: "2026-02-12",
                      },
                    });
                  }}
                  handleDeny={() => setisPopUpVisible(true)}
                />
              ))}
            </ul>
          </div>
          {/* Document Details Panel */}
          <div className="flex flex-col justify-between w-full px-4 border-l border-slate-300">
            <div className="w-full">
              <div className="mb-2">
                <h1>Document Details</h1>
              </div>
              <div className="flex px-4">
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
              <div className="grid grid-cols-2 w-full justify-around py-4">
                <DataBlock
                  title="Originator"
                  value={state.documentDetails.originator}
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Department"
                  value={state.documentDetails.department}
                  isInteractable={state.isInteractable}
                />
              </div>
              <div className="grid grid-cols-2 w-full justify-around py-4">
                <DataBlock
                  title="Revision Number"
                  value={state.documentDetails.revisionNumber}
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Date"
                  value={state.documentDetails.dateCreated}
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Revision Details"
                  value={state.documentDetails.revisionDetails}
                  isInteractable={state.isInteractable}
                  styling="col-span-2"
                />
              </div>
              <div className="grid grid-cols-2 w-full justify-around py-4">
                <DataBlock
                  title="Approver"
                  value={state.documentDetails.approver}
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Date"
                  value={state.documentDetails.dateApproved}
                  isInteractable={state.isInteractable}
                />
              </div>
            </div>
            {/*  */}
            <div className="flex w-full justify-end gap-2">
              {state.isInteractable && (
                <button
                  onClick={() => {
                    dispatch({
                      type: ACTION.CANCELUPDATE,
                    });
                  }}
                  className={
                    state.isInteractable
                      ? "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-black"
                      : "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-gray-300"
                  }
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {}}
                className={
                  state.isInteractable
                    ? "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-black hover:text-white hover:bg-black"
                    : "w-1/5 px-4 py-2 rounded-lg cursor-pointer text-gray-300"
                }
                disabled={!state.isInteractable}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPopUpVisible && (
        <PopUpModal onClose={() => {}}>
          <h2>Comment</h2>
          <textarea
            className="px-4 py-2 border rounded-lg resize-y min-h-32 outline-none"
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
          <div className="flex w-full justify-between gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 border rounded-lg cursor-pointer"
            >
              Submit
            </button>
          </div>
        </PopUpModal>
      )}
    </div>
  );
}
