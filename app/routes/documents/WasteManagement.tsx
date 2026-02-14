import { useEffect, useReducer, useState } from "react";
import { useSessionStore } from "stores/sessionStore";
import { PopUpModal, DocumentsPageLayout } from "~/components";
import DataBlock from "~/components/ui/DataBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";

enum ACTION {
  SETORIGINATOR = "SETORIGINATOR",
  SETDEPARTMENT = "SETDEPARTMENT",
  SETREVISIONNUM = "SETREVISIONNUM",
  SETREVISIONDETAILS = "SETREVISIONDETAILS",
  SETREVISIONDATE = "SETREVISIONDATE",
  SETAPPROVER = "SETAPPROVER",
  SETAPPROVEDDATE = "SETAPPROVEDDATE",
  FETCHDOCUDETAILS = "FETCHDOCUDETAILS",
}

type StateType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
};

type ActionType = {
  type: ACTION;
  payload: string | Partial<StateType>;
};

export default function WasteManagement() {
  const initialState: StateType = {
    originator: "None",
    department: "None",
    revisionNumber: "None",
    revisionDetails: "None",
    revisionDate: "None",
    approver: "None",
    approvedDate: "None",
  };
  const [isVisible, setIsVisible] = useState(false);
  const [token, setToken] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const role = useSessionStore((state) => state.role);
  const [state, dispatch] = useReducer(documentDetailsReducer, initialState);

  useEffect(() => {
    fetchDocumentDetails();
  }, []);

  const btnsVisible = isRoleAllowed(["originator", "coordinator"], role);

  async function fetchDocumentDetails() {
    const storedToken = localStorage.getItem("apiToken");
    setToken(storedToken ? storedToken : "");

    const response = await fetch("http://localhost/api/waste-management", {
      method: "get",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    dispatch({ type: ACTION.FETCHDOCUDETAILS, payload: data });
  }

  function documentDetailsReducer(state: StateType, action: ActionType) {
    const { type, payload } = action;

    if (typeof payload === "string") {
      switch (type) {
        case ACTION.SETORIGINATOR:
          return {
            ...state,
            originator: payload,
          };

        case ACTION.SETDEPARTMENT:
          return {
            ...state,
            department: payload,
          };

        case ACTION.SETREVISIONNUM:
          return {
            ...state,
            revisionNumber: payload,
          };
        case ACTION.SETREVISIONDETAILS:
          return {
            ...state,
            revisionDetails: payload,
          };
        case ACTION.SETREVISIONDATE:
          return {
            ...state,
            revisionDate: payload,
          };
        case ACTION.SETAPPROVER:
          return {
            ...state,
            approver: payload,
          };
        case ACTION.SETAPPROVEDDATE:
          return {
            ...state,
            approvedDate: payload,
          };

        default:
          return state;
      }
    }

    if (typeof payload === "object" && payload !== null) {
      switch (type) {
        case ACTION.FETCHDOCUDETAILS:
          return {
            ...state,
            ...payload,
          };

        default:
          return state;
      }
    }

    return state;
  }

  function handleRevisionClick() {
    setIsVisible(true);
  }

  function handleObsoleteClick() {}

  function handleCancel() {
    setTextAreaValue("");
    setIsVisible(false);
  }

  async function handleSubmit() {
    await fetch("", {
      method: "post",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return (
    <>
      <DocumentsPageLayout pagetitle="Waste Management Procedure">
        <div className="flex flex-col my-4 gap-4">
          {/* File Component */}
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
          <div className="grid grid-cols-4 gap-4">
            <DataBlock
              title="Originator"
              value={state.originator}
              styling="col-span-2"
            />
            <DataBlock
              title="Department"
              value={state.department}
              styling="col-span-2"
            />
            <DataBlock
              title="Revision Number"
              value="Revision Number Value"
              styling="col-span-2"
            />
            <DataBlock title="Date" value={state.revisionDate} styling="" />
            <DataBlock
              title="Revision Details"
              value={state.revisionDetails}
              styling="col-span-4"
            />
            <DataBlock
              title="Approver"
              value={state.approver}
              styling="col-span-2"
            />
            <DataBlock
              title="Date"
              value={state.approvedDate}
              styling="col-span-2"
            />
          </div>
        </div>
        {btnsVisible && (
          <div className="flex w-full justify-end gap-2">
            <button
              onClick={handleRevisionClick}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Revision
            </button>
            <button
              onClick={handleObsoleteClick}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Obsolete
            </button>
          </div>
        )}
      </DocumentsPageLayout>
      {isVisible && (
        <PopUpModal onClose={() => {}}>
          {/* <h2>Reason for Revision</h2> */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              className="rounded-lg resize-y outline-none text-xl font-bold"
            />
            <textarea
              className="rounded-lg resize-y min-h-32 outline-none"
              value={textAreaValue}
              placeholder="Reason for revision..."
              onChange={(e) => setTextAreaValue(e.target.value)}
            />
          </div>
          <div className="flex w-full justify-between gap-2">
            <button
              onClick={handleCancel}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="hover:bg-black hover:text-white w-1/5 px-4 py-2 rounded-lg cursor-pointer"
            >
              Submit
            </button>
          </div>
        </PopUpModal>
      )}
    </>
  );
}
