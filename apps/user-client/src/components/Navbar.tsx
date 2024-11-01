import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="grid grid-cols-[1fr_auto_1fr] grid-rows-[auto] items-center font-medium px-6 py-3">
      <div className="flex flex-row">
        <Link to={"/"}>
          <h2 className="text-[#1E0E62] text-2xl font-bold">Coursera</h2>
        </Link>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Link to={"/"}>
          <div className="">Home</div>
        </Link>
        <div className="">Courses</div>
        <div className="">Add-Course</div>
      </div>
      {false ? (
        <div className="flex flex-row items-center justify-end gap-2">
          <h2 className="text-lg">Accounts</h2>
          <h2>Logout</h2>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-end gap-2">
          <Link to={"/signup"}>
            <button className="text-[#151439] text-lg" type="button">
              Sign Up
            </button>
          </Link>
          <div className="bg-[#25DAC5] px-3 py-1 rounded-full">
            <Link to={"/signin"}>
              <button
                className="text-[#FFFFFF] text-lg font-semibold text-center"
                type="button"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
