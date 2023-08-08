import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downvoteAdvice, upvoteAdvice } from "../utils/adviceSlice";
import { downvoteComment, upvoteComment } from "../utils/commentSlice";
import Alert from "./Alert";

const UpvoteDownvote = ({ parentId, initialScore, insideComment = false }) => {
  const isUpvotedObject = useSelector((store) =>
    insideComment
      ? store.comment.isUpvotedByCurrentUser
      : store.advice.isUpvotedByCurrentUser
  );
  const isDownvotedObject = useSelector((store) =>
    insideComment
      ? store.comment.isDownvotedByCurrentUser
      : store.advice.isDownvotedByCurrentUser
  );
  const [isUpvoted, setIsUpvoted] = useState(
    isUpvotedObject[parentId.toString()]
  );
  const [isDownvoted, setIsDownvoted] = useState(
    isDownvotedObject[parentId.toString()]
  );

  const [showAlert, setShowAlert] = useState(false);

  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);
  // console.log(parentId, " -> ");
  // console.log("isUpvoted : ", isUpvoted);
  // console.log("isDownvoted : ", isDownvoted);

  const dispatch = useDispatch();
  const [score, setScore] = useState(initialScore);

  const token = window.localStorage.getItem("token");

  const changeCount = useRef(0);
  const makeAPICalls = (upvoted, downvoted) => {
    // NEW API
    fetch(
      `http://localhost:4000/api/v1/${
        insideComment ? "comment" : "advice"
      }/handleVotes/${parentId}`,
      {
        crossDomain: true,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          'Access-Control-Allow-Origin': 'true'
        },

        body: JSON.stringify({
          token,
          isUpvoted,
          isDownvoted,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {});
  };

  useEffect(() => {
    if (changeCount.current !== 0) {
      const t = setTimeout(() => makeAPICalls(isUpvoted, isDownvoted), 500);
      return () => {
        clearTimeout(t);
      };
    }

    changeCount.current = changeCount.current + 1;
  }, [isUpvoted, isDownvoted]);

  const handleUpvote = () => {
    if (isLoggedIn === false || isLoggedIn === null) {
      setShowAlert(true);
    } else {
      let change = 1;
      if (isUpvoted) change = -1;

      if (isDownvoted) {
        change = change + 1;
      }
      dispatch(
        insideComment ? upvoteComment({ parentId }) : upvoteAdvice({ parentId })
      );
      setScore(score + change);
      setIsUpvoted(1 - isUpvoted);
      if (isDownvoted) setIsDownvoted(0);
    }
  };

  const handleDownvote = () => {
    if (isLoggedIn === false || isLoggedIn === null) {
      setShowAlert(true);
    } else {
      let change = -1;
      if (isDownvoted) change = 1;

      if (isUpvoted) {
        change = change - 1;
      }
      dispatch(
        insideComment
          ? downvoteComment({ parentId })
          : downvoteAdvice({ parentId })
      );
      setScore(score + change);
      setIsDownvoted(1 - isDownvoted);
      if (isUpvoted) setIsUpvoted(0);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showAlert]);

  return (
    <>
      {showAlert && <Alert />}
      <button
        onClick={handleUpvote}
        className={`p-2 border ${
          isUpvoted === 1 && isLoggedIn ? "bg-green-600" : "bg-gray-200"
        } rounded-full hover:bg-green-400`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
      <span className="text-base font-medium"> {score} </span>
      <button
        onClick={handleDownvote}
        className={`p-2 ${
          isDownvoted === 1 && isLoggedIn ? "bg-red-600" : "bg-gray-200"
        } border rounded-full hover:bg-red-400`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </>
  );
};

export default UpvoteDownvote;
