import { useEffect, useReducer, useState, type ComponentProps } from "react";
import { useSessionStore } from "stores/sessionStore";
import { PopUpModal, DocumentsPageLayout, Button } from "~/components";
import { BUTTONTYPES } from "~/components/primitives/Button";
import DataBlock from "~/components/ui/DataBlock";
import { isRoleAllowed } from "~/utils/isRoleAllowed";
import type { Route } from "./+types/DocumentPage";
import { apiFetch } from "~/utils/apiFetch";

enum ACTION {
  SETORIGINATOR = "SETORIGINATOR",
  SETDEPARTMENT = "SETDEPARTMENT",
  SETREVISIONNUM = "SETREVISIONNUM",
  SETREVISIONDETAILS = "SETREVISIONDETAILS",
  SETREVISIONDATE = "SETREVISIONDATE",
  SETAPPROVER = "SETAPPROVER",
  SETAPPROVEDDATE = "SETAPPROVEDDATE",
  FETCHDOCUDETAILS = "FETCHDOCUDETAILS",
  SETUSERID = "SETUSERID",
  SETREVISIONREASON = "SETREVISIONREASON",
  SETREVISIONTITLE = "SETREVISIONTITLE",
}

type StateType = {
  originator: string;
  department: string;
  revisionNumber: string;
  revisionDetails: string;
  revisionDate: string;
  approver: string;
  approvedDate: string;
  userId: number | null;
  revisionTitle: string;
  revisionReason: string;
};

type ActionType =
  | { type: ACTION.SETORIGINATOR; payload: string }
  | { type: ACTION.SETDEPARTMENT; payload: string }
  | { type: ACTION.SETREVISIONNUM; payload: string }
  | { type: ACTION.SETREVISIONDETAILS; payload: string }
  | { type: ACTION.SETREVISIONDATE; payload: string }
  | { type: ACTION.SETAPPROVER; payload: string }
  | { type: ACTION.SETAPPROVEDDATE; payload: string }
  | { type: ACTION.SETREVISIONTITLE; payload: string }
  | { type: ACTION.SETREVISIONREASON; payload: string }
  | { type: ACTION.SETUSERID; payload: number | null }
  | { type: ACTION.FETCHDOCUDETAILS; payload: StateType };

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log("DocumentPage.tsx | params.documentId:", params.documentId);

  const response = await apiFetch(`/document/${params.documentId}`, {
    method: "GET",
  });
  const data = await response.json();

  if (!response.ok) {
    console.log("FAILED");
    console.error(data.message);
  }

  console.log("clientLoader | data:", data);

  return data;
}

export default function DocumentPage({ loaderData }: Route.ComponentProps) {
  const initialState: StateType = {
    originator: "None",
    department: "None",
    revisionNumber: "None",
    revisionDetails: "None",
    revisionDate: "None",
    approver: "None",
    approvedDate: "None",
    userId: null,
    revisionTitle: "",
    revisionReason: "",
  };

  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [token, setToken] = useState("");
  const [state, dispatch] = useReducer(documentDetailsReducer, initialState);
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  useEffect(() => {
    dispatch({ type: ACTION.FETCHDOCUDETAILS, payload: loaderData });
  }, []);

  const btnsVisible = isRoleAllowed(["originator", "coordinator"], role);

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
        case ACTION.SETUSERID:
          return {
            ...state,
            userId: payload,
          };
        case ACTION.SETREVISIONTITLE:
          return {
            ...state,
            revisionTitle: payload,
          };
        case ACTION.SETREVISIONREASON:
          return {
            ...state,
            revisionReason: payload,
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
    setPopUpVisible(true);
  }

  function handleObsoleteClick() {}

  function handleCancel() {
    dispatch({ type: ACTION.SETREVISIONTITLE, payload: "" });
    dispatch({ type: ACTION.SETREVISIONREASON, payload: "" });
    setPopUpVisible(false);
  }

  async function handleSubmit() {
    console.log("TITLE:", state.revisionTitle);
    console.log("REASON:", state.revisionReason);

    const response = await fetch("http://127.0.0.1/api/revision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: state.revisionTitle,
        reason: state.revisionReason,
        status: "coordinator_approval",
        user_id: userId,
        document_id: 3,
      }),
    });

    console.log("RESPONSE IS OK:", response.ok);

    const revisionData = await response.json();

    if (!response.ok) {
      console.error("FAILED");
      console.error(revisionData.message);
      return;
    }

    console.log("SUCCESS");
    console.log(revisionData);
    dispatch({ type: ACTION.SETREVISIONTITLE, payload: "" });
    dispatch({ type: ACTION.SETREVISIONREASON, payload: "" });
    setPopUpVisible(false);
  }

  return (
    <div>
      <DocumentsPageLayout pagetitle="Waste Management Procedure">
        <div className="flex flex-col my-4 gap-4">
          {/* File Component */}
          <div>
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
              value={state.revisionNumber}
              styling="col-span-2"
            />
            <DataBlock
              title="Date"
              value={state.revisionDate}
              styling="col-span-2"
            />
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
      {isPopUpVisible && (
        <PopUpModal onClose={() => {}}>
          {/* <h2>Reason for Revision</h2> */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={state.revisionTitle}
              placeholder="Title"
              className="resize-y outline-none text-xl font-bold"
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETREVISIONTITLE,
                  payload: e.target.value,
                })
              }
            />
            <textarea
              className="resize-y min-h-32 outline-none"
              value={state.revisionReason}
              placeholder="Reason for revision..."
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETREVISIONREASON,
                  payload: e.target.value,
                })
              }
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
