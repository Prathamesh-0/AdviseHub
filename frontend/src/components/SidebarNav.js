import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SidebarNav = () => {
  const topUsers = useSelector((store) => store.user.topUsers);

  if (topUsers.length === 0) {
    return (
      <div className="break-words border border-white ml-2 p-4 font-medium bg-green-500  w-[40vw] mt-[1rem] overflow-x-auto rounded-md hidden md:block h-[55vh]">
        <div className="flex flex-col items-center space-y-4">
          <span className="font-extrabold text-xl flex justify-center text-blue-900">
            Top Users
          </span>
          <div className="w-28 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-24 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-32 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-16 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-24 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-32 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-16 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-24 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-32 h-4 animate-pulse bg-gray-300 rounded"></div>
          <div className="w-16 h-4 animate-pulse bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="break-words border border-white ml-2 p-4 font-medium bg-green-500  w-[40vw] mt-[1rem] overflow-x-auto rounded-md hidden md:block h-[55vh]">
      <div>
        <Link to="./leaderboard">
          <span className="font-extrabold text-xl flex justify-center text-blue-900">
            Top Users
          </span>
        </Link>
        <ul className="my-3">
          {topUsers.map((user, index) => {
            return (
              <Link to={`./user/${user._id}`}>
                <li
                  key={user._id}
                  className="text-zinc-50  pr-2 py-1 flex justify-center "
                >
                  {user.username}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SidebarNav;
