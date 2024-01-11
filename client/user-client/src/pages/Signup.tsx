import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverApi } from "../serverApi";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setVisible(true);
      return;
    }
    setVisible(false);
    try {
      await fetch(`${serverApi}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      console.error(error);
    }
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    navigate("/signin");
  };
  return (
    <div className="min-h-[90vh] flex flex-row justify-center items-center">
      <div className="w-[430px] bg-slate-300 rounded-xl">
        <form
          className="mx-auto py-8 flex flex-col gap-5 w-[330px]"
          onSubmit={handleSubmit}
        >
          <h3 className="text-center font-bold text-[#1E0E62] text-4xl mb-6">
            Sign Up Now
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
          <input
            className="pl-2 py-2 rounded-md focus:outline-blue-500"
            id="confirm-password"
            name="confirm-password"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            placeholder="Confirm Password"
            required
            type="password"
            value={confirmPassword}
          />
          {visible ? (
            <p className="text-center font-medium text-red-500">
              Password do not match!
            </p>
          ) : null}
          <button
            className="bg-[#2866df] text-white font-semibold py-2 rounded-md hover:bg-[#215ac8]"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
