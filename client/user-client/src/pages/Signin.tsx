import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverApi } from "../serverApi";
import { Link } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${serverApi}/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
      }
      if (response.status === 401 || response.status === 404) {
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-[90vh] flex flex-row justify-center items-center">
      <div className="w-[430px] bg-slate-300 rounded-xl">
        <form
          className="mx-auto py-8 flex flex-col gap-5 w-[330px]"
          onSubmit={handleSubmit}
        >
          <h3 className="text-center font-bold text-[#1E0E62] text-4xl mb-6">
            Sign In
          </h3>
          <input
            className="pl-2 py-2 rounded-md focus:outline-blue-500"
            id="email"
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
          <input
            className="pl-2 py-2 rounded-md focus:outline-blue-500"
            id="password"
            name="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            placeholder="Password"
            required
            type="password"
            value={password}
          />
          {visible ? (
            <p className="text-center text-red-500 font-medium">
              Invalid email or password
            </p>
          ) : null}
          <button
            type="submit"
            className="bg-[#2866df] text-white font-semibold py-2 rounded-md hover:bg-[#215ac8]"
          >
            Sign In
          </button>
        </form>
        <div className="flex flex-row justify-center pb-5">
          <Link to="/signup">
            <p className="font-medium">Don't have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
