import React, { useEffect, useRef, useState } from "react";
import {
  faExclamationTriangle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "../utils/searchSlice";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const recommendations = useSelector((store) => store.search.recommendations);
  const [gotresults, setGotResults] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const dispatch = useDispatch();
  const ref = useRef();

  // console.log("searchQuery", searchQuery);
  const navigate = useNavigate();

  const getRecommendations = (searchText) => {
    if (searchText in recommendations) {
      setSearchResults(recommendations[searchText]);
      setShowResults(true);
    } else {
      fetch(`http://localhost:4000/api/v1/recommend/${searchText}`, {
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          'Access-Control-Allow-Origin': 'true'
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (
            json.recommendations !== null &&
            json.recommendations !== undefined
          ) {
            setShowResults(true);
            setSearchResults(json.recommendations);
            dispatch(
              addEntry({ key: searchText, value: json.recommendations })
            );
          }
        });
    }

    setGotResults(true);
  };

  useEffect(() => {
    if (searchQuery.length !== 0) {
      const t = setTimeout(() => getRecommendations(searchQuery), 200);
      return () => {
        clearTimeout(t);
      };
    }
  }, [searchQuery]);

  const red = (link) => {
    navigate(link);
    setTimeout(() => {
      setShowResults(false);
      setSearchQuery("");
    }, 1);
  };

  const closeOpenMenus = (e) => {
    if (ref.current && showResults && !ref.current.contains(e.target)) {
      setShowResults(false);
    }
  };

  document.addEventListener("mousedown", closeOpenMenus);

  return (
    <div
      ref={ref}
      onBlur={() => {
        // console.log("nsvn");
      }}
      onFocus={() => setShowResults(true)}
      className="mkc relative ml-4 mx-4 flex items-center md:flex-grow md:ml-[22vw] md:width-full"
    >
      <input
        type="text"
        placeholder="Search Users"
        className="bg-slate-500 py-2 px-4 rounded-l-2xl p-2 pl-4 md:px-6 w-[50vw] lg:w-[40vw] md:w-[36vw] sm:w-[60vw]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="rounded-r-2xl bg-slate-900 px-5 h-11">
        <FontAwesomeIcon icon={faSearch} />
      </button>

      {searchResults.length > 0 && (
        <ul
          className={`${
            showResults ? "" : "hidden"
          } absolute top-full left-0 right-0 bg-slate-200 shadow-lg p-2 mt-2 mr-[5.5vw] rounded-lg`}
        >
          {searchResults.map((result) => (
            <Link to={`#`} onClick={() => red(`./user/${result.userId}`)}>
              <li
                key={result.userId}
                className="py-1 px-2 text-slate-700 hover:bg-slate-400 rounded-md"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span className="ml-3">{result.username}</span>
              </li>
            </Link>
          ))}
        </ul>
      )}
      {gotresults && searchResults.length === 0 ? (
        <ul className="absolute top-full left-0 right-0 bg-slate-200 shadow-lg p-2 mt-2 mr-[5.5vw] rounded-lg flex items-center justify-center">
          <li className="py-2 text-slate-700 rounded-md">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-gray-500"
            />
            <span className="ml-3">No matching user found</span>
          </li>
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Search;
