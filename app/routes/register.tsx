import { useReducer } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "~/utils/apiFetch";

enum ACTION {
  SETUSERDETAIL = "SETUSERDETAIL",
}

type UserStateType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

type ActionType = {
  type: ACTION.SETUSERDETAIL;
  payload: Partial<UserStateType>;
};

export default function Register() {
  const initialState: UserStateType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  };

  const [userState, userDispatch] = useReducer(registerReducer, initialState);
  const navigate = useNavigate();

  function registerReducer(state: UserStateType, action: ActionType) {
    switch (action.type) {
      case ACTION.SETUSERDETAIL:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  }

  async function handleRegister() {
    try {
      const apiResponse = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: userState.firstName,
          lastName: userState.lastName,
          email: userState.email,
          password: userState.password,
          role: userState.role,
        }),
      });

      if (!apiResponse.ok) {
        return alert(apiResponse.message);
      }

      console.log("User registered successfully", apiResponse.data);
      navigate("/");
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-6">
      <form
        className="flex flex-col w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg p-6 gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Register
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="firstName"
                  className="mb-1 font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  value={userState.firstName}
                  onChange={(e) =>
                    userDispatch({
                      type: ACTION.SETUSERDETAIL,
                      payload: {
                        firstName: e.target.value,
                      },
                    })
                  }
                  className="border w-full border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  type="text"
                />
              </div>

              <div className="flex flex-col flex-1">
                <label
                  htmlFor="lastName"
                  className="mb-1 font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  value={userState.lastName}
                  onChange={(e) =>
                    userDispatch({
                      type: ACTION.SETUSERDETAIL,
                      payload: {
                        lastName: e.target.value,
                      },
                    })
                  }
                  className="border w-full border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  type="text"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="email"
                  className="mb-1 font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  value={userState.email}
                  onChange={(e) =>
                    userDispatch({
                      type: ACTION.SETUSERDETAIL,
                      payload: {
                        email: e.target.value,
                      },
                    })
                  }
                  className="border w-full border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  type="email"
                />
              </div>

              <div className="flex flex-col flex-1">
                <label
                  htmlFor="password"
                  className="mb-1 font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  value={userState.password}
                  onChange={(e) =>
                    userDispatch({
                      type: ACTION.SETUSERDETAIL,
                      payload: {
                        password: e.target.value,
                      },
                    })
                  }
                  className="border w-full border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  type="password"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="role" className="mb-1 font-medium text-gray-700">
                Role
              </label>
              <select
                value={userState.role}
                onChange={(e) =>
                  userDispatch({
                    type: ACTION.SETUSERDETAIL,
                    payload: {
                      role: e.target.value,
                    },
                  })
                }
                name="role"
                id="role"
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              >
                <option value="">Select a Role</option>
                <option value="user">User</option>
                <option value="originator">Originator</option>
                <option value="coordinator">Coordinator (DCC)</option>
                <option value="superior">Superior</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
