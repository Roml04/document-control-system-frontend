import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useReducer, useState } from "react";

enum ACTION {
  SETEMAILVALUE = "SETEMAILVALUE",
  SETPASSWORDVALUE = "SETPASSWORDVALUE",
}

type StateType = {
  email: string;
  password: string;
};

type ActionType = {
  type: ACTION;
  payload: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const initialState: StateType = {
    email: "",
    password: "",
  };

  // use the reducer hook
  const [state, dispatch] = useReducer(loginReducer, initialState);

  function loginReducer(state: StateType, action: ActionType) {
    switch (action.type) {
      case ACTION.SETEMAILVALUE:
        return {
          ...state,
          email: action.payload,
        };

      case ACTION.SETPASSWORDVALUE:
        return {
          ...state,
          password: action.payload,
        };

      default:
        return state;
    }
  }

  async function handleLogin() {
    try {
      const response = await fetch(`http://127.0.0.1:80/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Authorization": "Bearer LARAVEL_SANCTUM_TOKEN"
        },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);

        return;
      }

      console.log(result);
      console.log(result.message);
      navigate("/documents");
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col justify-center items-center border border-gray-400 rounded-lg p-4 gap-4"
      >
        <div className="flex flex-col items-center">
          <h1>Login</h1>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              value={state.email}
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETEMAILVALUE,
                  payload: e.target.value,
                })
              }
              className="border border-gray-400 rounded-md outline-none px-2 py-1"
              type="email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              value={state.password}
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETPASSWORDVALUE,
                  payload: e.target.value,
                })
              }
              className="border border-gray-400 rounded-md outline-none px-2 py-1"
              type="password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 border border-gray-400 rounded-lg cursor-pointer"
        >
          Login
          {/* <p className="px-4 py-2 border border-gray-400 rounded-lg">Login</p> */}
        </button>
      </form>
    </div>
  );
}
