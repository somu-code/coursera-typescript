/** @format */

import React from "react";
//import 'register-image' from '../../public/undraw_sign_up_n6im.svg';

export default function SignInPage(): React.JSX.Element {
  return (
    <>
      {/* <div className="min-h-screen py-40 bg-gradient-to-r from-cyan-500 to-blue-500 ">
				<div className="container mx-auto">
					<div className="flex flex-col lg-flex-row w-10/12 lg:w-8/12 bg-white rounded-x1-mx-auto-shadow-lg overflow-hidden">
						<div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center">
							<h1 className="text-white text-3xl mb-3">Welcome</h1>
							<div>
								<p className="text-black">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Doloremque facilis, cumque tenetur optio aliquam, maiores
									cupiditate, recusandae incidunt quasi quas eaque ut saepe
									perspiciatis eveniet in repellat aut quo nemo?
								</p>
							</div>
						</div>
						<div className="w-full lg:w-1/2 py-16 px-12">
							<h2 className="text-3xl mb-4">Register</h2>
							<p className="mb-4">
								Create your account. It's free and only take a minute
							</p>
							<form action="#">
								<div className="grid grid-cols-2 gap-5">
									<div>
										<input
											type="text"
											placeholder="Email"
											className="border border-gray-400 py-1 px-2 w-full"
										/>
									</div>
									<div>
										<input
											type="password"
											placeholder="Password"
											className="border border-gray-400 py-1 px-2 w-full mt-5"
										/>
									</div>
								</div>
								<div className="mt-5">
									<input type="checkbox" className="border border-gray-400" />
									<span>
										I accept the{' '}
										<a href="#" className="text-purple-500 font-semibold">
											Terms of Use{' '}
										</a>{' '}
										<a href="#" className="text-purple-500 font-semibold">
											& Privacy Policy
										</a>
									</span>
								</div>
								<div className="mt-5">
									<button className="w-full bg-purple-500 py-3 text-center text-white">
										Register
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div> */}
      <div className="min-h-[90vh] flex flex-row justify-center items-center">
        <div className="w-[430px] bg-slate-300 rounded-xl">
          <form
            // onSubmit={handleSubmit}
            className="mx-auto py-8 flex flex-col gap-5 w-[330px]"
          >
            <h3 className="text-center font-bold text-[#1E0E62] text-4xl mb-6">
              Sign Up Now
            </h3>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              className="pl-2 py-2 rounded-md focus:outline-blue-500"
              // onChange={(event) => setEmail(event.target.value)}
              // value={email}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              className="pl-2 py-2 rounded-md focus:outline-blue-500"
              // onChange={(event) => setPassword(event.target.value)}
              //value={password}
            />
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="Confirm Password"
              required
              className="pl-2 py-2 rounded-md focus:outline-blue-500"
              // onChange={(event) => setConfirmPassword(event.target.value)}
              // value={confirmPassword}
            />
            {/* {visible ? (
							<p className="text-center font-medium text-red-500">
								Password do not match!
							</p>
						) : null} */}
            <button
              type="submit"
              className="bg-[#2866df] text-white font-semibold py-2 rounded-md hover:bg-[#215ac8]"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
