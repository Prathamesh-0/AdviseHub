import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import Search from "./Search";
import UserNav from "./UserNav";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTopUsers } from "../utils/userSlice";
import { initializeTags } from "../utils/tagSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/topUsers", {
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        'Access-Control-Allow-Origin': 'true'
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        dispatch(addTopUsers(json));
      });

    fetch("http://localhost:4000/api/v1/tags", {
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        'Access-Control-Allow-Origin': 'true'
      },
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch(initializeTags(json.tags));
      });
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <Search />

          <div className="hidden md:flex items-center space-x-4 ml-4">
            <Link to="/newAdvice" className="mx-2">
              <span className="hover:text-green-400">New Advice</span>
            </Link>
            <Link to="/pickTags" className="">
              <span className="hover:text-green-400">Pick Tags</span>
            </Link>
          </div>

          <div className="flex ml-4 z-100">
            <UserNav />
          </div>

          <div className="flex items-center ml-4 md:hidden">
            <FontAwesomeIcon
              onClick={toggleMenu}
              icon={isMenuOpen ? faTimes : faBars}
              className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-900">
          <div className="">
            <Link
              to="/newAdvice"
              className="mx-2 block px-4 py-2 text-base font-medium text-white hover:bg-gray-700 rounded-md"
            >
              New Advice
            </Link>
            <Link
              to="/pickTags"
              className="mx-2 block px-4 py-2 text-base font-medium text-white hover:bg-gray-700 rounded-md"
            >
              Pick Tags
            </Link>
            <Link
              to="./leaderboard"
              className="mx-2 block px-4 py-2 text-base font-medium text-white hover:bg-gray-700 rounded-md"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
