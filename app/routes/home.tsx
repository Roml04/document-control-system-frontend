import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useState } from "react";
import { useSessionStore } from "stores/sessionStore";
import { apiFetch } from "~/utils/apiFetch";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateSession = useSessionStore((state) => state.updateSession);

  async function handleLogin() {
    try {
      const apiResponse = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!apiResponse.ok) {
        console.log("An error occurred:", apiResponse.message);
        return alert(apiResponse.message);
      }

      console.log("User successfully logged in", apiResponse.data);

      const { id, firstName, lastName, role } = apiResponse.data;

      updateSession({
        userId: id,
        firstName: firstName,
        lastName: lastName,
        role: role,
      });

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
