import { useEffect, useReducer, useState } from "react";

type DataBlockProps = {
  title: string;
  value: string;
  styling?: string;
  isInteractable?: boolean;
};

enum ACTIONS {
  SETINTERACTABLEENABLED = "SETINTERACTABLEENABLED",
  SETINTERACTABLEDISABLED = "SETINTERACTABLEDISABLED",
  CANCELUPDATE = "CANCELUPDATE",
  UPDATEDETAIL = "UPDATEDETAIL",
}

type StateTypes = {
  isInteractable: boolean;
  isValueEnabled: boolean;
  documentDetail: string | undefined;
};

type ActionTypes = {
  type: ACTIONS;
  payload?: string;
};

export default function DataBlock({
  title,
  value,
  styling,
  isInteractable,
}: DataBlockProps) {
  const initialState: StateTypes = {
    isInteractable: false,
    isValueEnabled: false,
    documentDetail: "Unknown",
  };

  const [inputValue, setInputValue] = useState(value);
  const [state, dispatch] = useReducer(dataBlockReducer, initialState);

  useEffect(() => {
    isInteractable
      ? dispatch({ type: ACTIONS.SETINTERACTABLEENABLED })
      : dispatch({ type: ACTIONS.SETINTERACTABLEDISABLED });

    dispatch({ type: ACTIONS.UPDATEDETAIL, payload: value });
  }, []);

  function dataBlockReducer(state: StateTypes, action: ActionTypes) {
    switch (action.type) {
      case ACTIONS.SETINTERACTABLEENABLED:
        return {
          ...state,
          isInteractable: true,
          isValueEnabled: true,
        };

      case ACTIONS.SETINTERACTABLEDISABLED:
        return {
          ...state,
          isInteractable: false,
          isValueEnabled: false,
        };

      case ACTIONS.CANCELUPDATE:
        return state;

      case ACTIONS.UPDATEDETAIL:
        const actionPayLoad = !action.payload ? action.payload : "Unknown";

        return {
          ...state,
          documentDetail: actionPayLoad,
        };

      default:
        return state;
    }
  }

  return (
    <div className={`flex w-full flex-col px-4 outline-none ${styling}`}>
      <h3>{title}</h3>
      {isInteractable ? (
        <input
          className="outline-none text-gray-400"
          type="text"
          value={state.documentDetail}
          onChange={(e) =>
            dispatch({ type: ACTIONS.UPDATEDETAIL, payload: e.target.value })
          }
        />
      ) : (
        <p className="text-gray-400">{inputValue}</p>
      )}
    </div>
  );
}
