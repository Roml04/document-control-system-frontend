import { useEffect, useReducer, type ComponentPropsWithoutRef } from "react";

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
        console.log("enabled payload:", action.payload);
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
    <div className={`flex w-full flex-col px-4 outline-none ${styling}`}>
      <h3>{title}</h3>
      {state.isInteractable ? (
        <input
          className="px-1 outline-none border border-slate-400 rounded-sm text-black"
          type="text"
          value={state.documentDetail}
          onChange={(e) =>
            dispatch({ type: ACTION.UPDATEDETAIL, payload: e.target.value })
          }
        />
      ) : (
        <p className="px-1 text-gray-400">{state.documentDetail}</p>
      )}
    </div>
  );
}
