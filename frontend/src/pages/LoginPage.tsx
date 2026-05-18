import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/axiosClient";
import type { LoginResponse } from "../types/auth";
import { setToken } from "../utils/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function login() {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    setToken(response.data.access_token);

    navigate("/projects");
  }

  return (
    <div
      className="
      p-8
      flex
      flex-col
      gap-4
      max-w-md
    "
    >
      <h1
        className="
        text-2xl
        font-bold
      "
      >
        Login
      </h1>

      <input
        className="border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="
          bg-black
          text-white
          p-2
        "
        onClick={login}
      >
        Login
      </button>
    </div>
  );
}
