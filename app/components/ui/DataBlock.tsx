import { useEffect, useReducer } from "react";

enum ACTION {
  SETINTERACTABLEENABLED = "SETINTERACTABLEENABLED",
  SETINTERACTABLEDISABLED = "SETINTERACTABLEDISABLED",
  CANCELUPDATE = "CANCELUPDATE",
  UPDATEDETAIL = "UPDATEDETAIL",
}

type DataBlockProps = {
  title: string;
  value: string;
  isInteractable?: boolean;
  styling?: string;
};

type StateTypes = {
  isInteractable: boolean;
  documentDetail: string | undefined;
};

type ActionTypes = {
  type: ACTION;
  payload?: string;
};

export default function DataBlock({
  title,
  value,
  isInteractable,
  styling,
}: DataBlockProps) {
  const initialState: StateTypes = {
    isInteractable: false,
    documentDetail: value,
  };

  const [state, dispatch] = useReducer(dataBlockReducer, initialState);

  useEffect(() => {
    dispatch({ type: ACTION.UPDATEDETAIL, payload: value });
  }, [value]);

  useEffect(() => {
    isInteractable
      ? dispatch({ type: ACTION.SETINTERACTABLEENABLED })
      : dispatch({ type: ACTION.SETINTERACTABLEDISABLED });
  }, [isInteractable]);

  function dataBlockReducer(state: StateTypes, action: ActionTypes) {
    switch (action.type) {
      case ACTION.SETINTERACTABLEENABLED:
        return {
          ...state,
          isInteractable: true,
        };

      case ACTION.SETINTERACTABLEDISABLED:
        return {
          ...state,
          isInteractable: false,
        };

      case ACTION.UPDATEDETAIL:
        return {
          ...state,
          documentDetail: action.payload ?? state.documentDetail,
        };

      default:
        return state;
    }
  }

  return (
    <div
      className={`w-full bg-white rounded-xl transition-all duration-200 ${styling}`}
    >
      <p className="text-sm text-gray-500 tracking-wide">{title}</p>
      {state.isInteractable ? (
        <input
          type="text"
          value={state.documentDetail}
          onChange={(e) =>
            dispatch({ type: ACTION.UPDATEDETAIL, payload: e.target.value })
          }
          className={`w-full
            font-medium
            bg-slate-50
            border border-gray-300
            rounded-lg
            px-3 py-2
            outline-none
            transition
            focus:bg-white
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            text-lg`}
        />
      ) : (
        <p
          className={`w-full
            font-medium
            bg-slate-50
            border border-gray-300
            rounded-lg
            px-3 py-2
            outline-none
            transition
            focus:bg-white
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            text-lg ${state.documentDetail === "None" ? "text-gray-400" : "text-gray-800"}`}
        >
          {state.documentDetail}
        </p>
      )}
    </div>
  );
}
