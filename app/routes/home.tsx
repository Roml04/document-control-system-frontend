import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  // use the reducer hook
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const isValid = true;

  function handleLogin() {
    console.log("email:", emailValue);
    console.log("password:", passwordValue);

    if (!isValid) throw Error("Invalid auth details");

    navigate("/documents");
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
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="border border-gray-400 rounded-md outline-none px-2 py-1"
              type="email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="border border-gray-400 rounded-md outline-none px-2 py-1"
              type="password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 border border-gray-400 rounded-lg cursor-pointer"
          onClick={handleLogin}
        >
          Login
          {/* <p className="px-4 py-2 border border-gray-400 rounded-lg">Login</p> */}
        </button>
      </form>
    </div>
  );
}
