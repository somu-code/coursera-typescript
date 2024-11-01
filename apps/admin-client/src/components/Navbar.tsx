/** @format */

import React from "react";
import { Link } from "react-router-dom";

export function Navbar(): React.JSX.Element {
  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">Your Logo</div>

          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-white hover:text-zinc-400">
              Home
            </a>
            <a href="#" className="text-white hover:text-zinc-400">
              About
            </a>
            <div className="text-white hover:text-zinc-400">
              <Link to="/signin">SignIn</Link>
            </div>
            <a href="#" className="text-white hover:text-zinc-400">
              SignUp
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
