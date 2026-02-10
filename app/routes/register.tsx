import { useReducer } from "react";
import { useNavigate } from "react-router";

enum ACTION {
  SETFIRSTNAME = "SETFIRSTNAME",
  SETLASTNAME = "SETLASTNAME",
  SETEMAIL = "SETEMAIL",
  SETPASSWORD = "SETPASSWORD",
  SETROLE = "SETROLE",
}

type StateType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

type ActionType = {
  type: ACTION;
  payload: string;
};

export default function Register() {
  const initialState: StateType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  };

  const [state, dispatch] = useReducer(registerReducer, initialState);
  const navigate = useNavigate();

  function registerReducer(state: StateType, action: ActionType) {
    switch (action.type) {
      case ACTION.SETFIRSTNAME:
        return {
          ...state,
          firstName: action.payload,
        };
      case ACTION.SETLASTNAME:
        return {
          ...state,
          lastName: action.payload,
        };
      case ACTION.SETEMAIL:
        return {
          ...state,
          email: action.payload,
        };
      case ACTION.SETPASSWORD:
        return {
          ...state,
          password: action.payload,
        };
      case ACTION.SETROLE:
        return {
          ...state,
          role: action.payload,
        };
      default:
        return state;
    }
  }

  async function handleRegister() {
    try {
      const response = await fetch(`http://127.0.0.1:80/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Authorization": "Bearer LARAVEL_SANCTUM_TOKEN"
        },
        body: JSON.stringify({
          first_name: state.firstName,
          last_name: state.lastName,
          email: state.email,
          password: state.password,
          role: state.role,
        }),
      });

      const result = await response.json();

      console.log(result);

      // return;

      if (!response.ok) {
        console.error(result.message);

        return;
      }

      console.log(result.message);
      navigate("/documents");
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-2">
      <form
        className="flex flex-col justify-center items-end border border-gray-400 rounded-lg p-4 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div className="flex flex-col items-start">
          <h1>Register</h1>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <label htmlFor="email">First Name</label>
              <input
                value={state.firstName}
                onChange={(e) =>
                  dispatch({
                    type: ACTION.SETFIRSTNAME,
                    payload: e.target.value,
                  })
                }
                className="border border-gray-400 rounded-md outline-none px-2 py-1"
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Last Name</label>
              <input
                value={state.lastName}
                onChange={(e) =>
                  dispatch({
                    type: ACTION.SETLASTNAME,
                    payload: e.target.value,
                  })
                }
                className="border border-gray-400 rounded-md outline-none px-2 py-1"
                type="text"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: ACTION.SETEMAIL,
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
                    type: ACTION.SETPASSWORD,
                    payload: e.target.value,
                  })
                }
                className="border border-gray-400 rounded-md outline-none px-2 py-1"
                type="password"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Role</label>
            <select
              value={state.role}
              onChange={(e) =>
                dispatch({
                  type: ACTION.SETROLE,
                  payload: e.target.value,
                })
              }
              name="role"
              id="role"
              className="w-full border border-gray-400 rounded-md outline-none px-2 py-1"
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
          className="px-4 py-2 border border-gray-400 rounded-lg cursor-pointer"
          // onClick={handleRegister}
        >
          Register
          {/* <p className="px-4 py-2 border border-gray-400 rounded-lg">Login</p> */}
        </button>
      </form>
    </div>
  );
}
