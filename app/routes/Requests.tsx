import { useEffect, useReducer, useState } from "react";
import { Icon, PopUpModal } from "~/components";
import PressableIcon from "~/components/primitives/PressableIcon";
import DataBlock from "~/components/ui/DataBlock";
import DropDownItem from "~/components/ui/DropDownItem";

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

export default function Requests() {
  const testData: { title: string; reason: string }[] = [
    {
      title: "For Approval - Revision of Waste Management",
      reason:
        "Updated guidelines required to comply with new environmental regulations.",
    },
    {
      title: "For Review - Employee Code of Conduct",
      reason:
        "Periodic review to ensure policies remain aligned with company values.",
    },
    {
      title: "For Approval - IT Security Policy Update",
      reason: "Necessary changes due to recent cybersecurity audit findings.",
    },
    {
      title: "For Approval - Revision",
      reason: "Reason",
    },
  ];

  const documentData: DocumentDataTypes = {
    originator: "Maria Santos",
    department: "Human Resources",
    revisionNumber: "Rev-03",
    revisionDetails:
      "Updated employee leave policy to include remote work options",
    dateCreated: "2026-02-07",
    approver: "Juan Dela Cruz",
    dateApproved: "2026-02-08",
  };

  const initialState: StateTypes = {
    isSubmitEnabled: false,
    isInteractable: false,
    documentDetails: {
      originator: "Unknown",
      department: "Unknown",
      revisionNumber: "Unknown",
      revisionDetails: "None",
      dateCreated: "0000-00-00",
      approver: "Unknown",
      dateApproved: "0000-00-00",
    },
    previousDocumentDetails: null,
  };

  const [state, dispatch] = useReducer(requestsReducer, initialState);

  const [textAreaValue, setTextAreaValue] = useState("");
  const [isPopUpVisible, setisPopUpVisible] = useState(false);

  useEffect(() => {
    console.log("Document Details Changed:", state.documentDetails);
  }, [state.documentDetails]);

  function requestsReducer(state: StateTypes, action: ActionTypes) {
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

  function handleCancel() {
    setTextAreaValue("");
    setisPopUpVisible(false);
  }

  function handleSubmit() {}

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full px-4 py-4 gap-2">
        <div className="flex gap-8 h-full ">
          {/* Requests Panel */}
          <div className="flex flex-col w-3/4 gap-2 h-full">
            <h1>Requests</h1>
            <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
              {testData.map((item, index) => (
                <DropDownItem
                  key={index}
                  title={item.title}
                  description={item.reason}
                  handleApprove={() => {
                    dispatch({
                      type: ACTION.ENABLESUBMIT,
                      payload: documentData,
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
              <div>
                <h1>Document Details</h1>
              </div>
              <div className="flex justify-between border-b border-slate-300">
                <div className="flex flex-col w-full p-4 rounded-lg gap-2">
                  <h3>File</h3>
                  <div className="flex justify-between items-center px-4 py-2 border border-slate-300 rounded-lg">
                    <a
                      className="underline cursor-pointer"
                      href=""
                      target="_blank"
                    >
                      <p>file.docx</p>
                    </a>
                    <PressableIcon
                      iconName="close"
                      onClick={() => console.log("Removed attachment")}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 w-full justify-around py-4 border-b border-slate-300">
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
              <div className="grid grid-cols-2 gap-y-4 w-full justify-around py-4 border-b border-slate-300">
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
