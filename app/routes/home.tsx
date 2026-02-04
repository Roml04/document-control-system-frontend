import { useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  function handleLogin() {
    /*
     * Handle authentication
     */

    navigate("/documents");
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-2">
      <div className="flex flex-col justify-center items-center border border-gray-400 rounded-lg p-4 gap-4">
        <div className="flex flex-col items-center">
          <h1>Login</h1>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              className="border border-gray-400 rounded-md outline-none px-2 py-1"
              type="Email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              className="border border-gray-400 rounded-md outline-none px-2 py-1"
              type="Password"
            />
          </div>
        </div>
        <div onClick={handleLogin} className="cursor-pointer">
          <p className="px-4 py-2 border border-gray-400 rounded-lg">Login</p>
        </div>
      </div>
    </div>
  );
}
