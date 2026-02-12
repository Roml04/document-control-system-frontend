import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useReducer } from "react";

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
      const token = localStorage.getItem("apiToken");

      const response = await fetch(`http://127.0.0.1/api/user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
      });

      const result = await response.json();
      console.error("RESPONSE:", response);

      if (!response.ok) {
        console.error("FAILED:", result);
        console.error(result.message);

        return;
      }

      console.log("SUCCESS", result);
      console.log(result.message);

      navigate("/documents");
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-6 gap-6"
      >
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>

          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: ACTION.SETEMAILVALUE,
                    payload: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                type="email"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: ACTION.SETPASSWORDVALUE,
                    payload: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                type="password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
