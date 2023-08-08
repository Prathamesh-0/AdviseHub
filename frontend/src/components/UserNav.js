import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../utils/userSlice";

const UserNav = () => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);

  const dispatch = useDispatch();

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(logOut());
  };

  if (isLoggedIn) {
    return (
      <div className="">
        <button
          className="ml-4 text-white"
          onClick={() => setIsDropdownActive(!isDropdownActive)}
          onBlur={() => {
            setTimeout(() => {
              setIsDropdownActive(false);
            }, 200);
          }}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
        {isDropdownActive && (
          <ul className=" text-white flex flex-col fixed top-12 right-5 my-2 bg-slate-500 w-25 rounded-lg">
            <li
              onClick={handleLogout}
              className="py-3 pl-4 pr-14 hover:bg-slate-800"
            >
              Logout
            </li>
          </ul>
        )}
      </div>
    );
  } else {
    return (
      <div className="">
        <button
          className="ml-4 text-white"
          onClick={() => setIsDropdownActive(!isDropdownActive)}
          onBlur={() => {
            setTimeout(() => {
              setIsDropdownActive(false);
            }, 200);
          }}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
        {isDropdownActive && (
          <ul className=" text-white flex flex-col fixed top-12 right-5 my-2 bg-slate-500 w-25 rounded-lg">
            <Link to="/login" className="">
              <li className="py-3 pl-4 pr-14 hover:bg-slate-800">Login</li>
            </Link>
            <hr />
            <Link to="/register" className="">
              <li className="py-3 pl-4 pr-14 hover:bg-slate-800">Signup</li>
            </Link>
          </ul>
        )}
      </div>
    );
  }
};

export default UserNav;
