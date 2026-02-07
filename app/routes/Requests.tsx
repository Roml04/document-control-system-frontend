import { useReducer, useState } from "react";
import { useNavigate } from "react-router";
import { PopUpModal } from "~/components";
import DataBlock from "~/components/ui/DataBlock";
import DropDownItem from "~/components/ui/DropDownItem";

enum ACTION {
  ENABLESUBMIT = "ENABLESUBMIT",
  DISABLESUBMIT = "DISABLESUBMIT",
}

type InitialStateTypes = {
  isSubmitEnabled: boolean;
  isInteractable: boolean;
};

type StateTypes = {
  isSubmitEnabled: boolean;
  isInteractable: boolean;
};

type ActionTypes = {
  type: ACTION;
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

  const initialState: InitialStateTypes = {
    isSubmitEnabled: false,
    isInteractable: false,
  };

  const [state, dispatch] = useReducer(requestsReducer, initialState);

  const [textAreaValue, setTextAreaValue] = useState("");
  const [isPopUpVisible, setisPopUpVisible] = useState(false);

  function requestsReducer(state: StateTypes, action: ActionTypes) {
    switch (action.type) {
      case ACTION.ENABLESUBMIT:
        return {
          ...state,
          isSubmitEnabled: true,
          isInteractable: true,
        };

      case ACTION.DISABLESUBMIT:
        return {
          ...state,
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
          {/* Request Panel */}
          <div className="flex flex-col w-3/4 gap-2 h-full">
            <h1>Requests</h1>
            <ul className="flex flex-col gap-2 pr-4 pb-10 h-full overflow-y-scroll">
              {testData.map((item, index) => (
                <DropDownItem
                  key={index}
                  title={item.title}
                  description={item.reason}
                  handleApprove={() => dispatch({ type: ACTION.ENABLESUBMIT })}
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
              <div className="flex justify-between border-b border-slate-400">
                <div className="flex flex-col w-fit p-4 rounded-lg">
                  <h3>File</h3>
                  <a
                    className="underline cursor-pointer"
                    href=""
                    target="_blank"
                  >
                    <p>file.docx</p>
                  </a>
                </div>
                <button className="w-fit px-4 py-2 ">
                  <p className="w-fit cursor-pointer">Attach File</p>
                </button>
              </div>
              <div className="grid grid-cols-2 w-full justify-around py-4 border-b border-slate-400">
                <DataBlock
                  title="Originator"
                  value="Originator Value"
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Department"
                  value="Department Value"
                  isInteractable={state.isInteractable}
                />
              </div>
              <div className="grid grid-cols-2 gap-y-4 w-full justify-around py-4 border-b border-slate-400">
                <DataBlock
                  title="Revision Number"
                  value="Revision Number Value"
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Revision Details"
                  value="Revision Details Value"
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Date"
                  value="Date Value"
                  isInteractable={state.isInteractable}
                />
              </div>
              <div className="grid grid-cols-2 w-full justify-around py-4">
                <DataBlock
                  title="Approver"
                  value="Approver Value"
                  isInteractable={state.isInteractable}
                />
                <DataBlock
                  title="Date"
                  value="Date Value"
                  isInteractable={state.isInteractable}
                />
              </div>
            </div>
            {/*  */}
            <div className="flex w-full justify-end gap-2">
              {state.isInteractable && (
                <button
                  onClick={() => dispatch({ type: ACTION.DISABLESUBMIT })}
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
