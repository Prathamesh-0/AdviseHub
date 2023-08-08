import React, { useEffect } from "react";
import Comment from "./Comment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  addMultipleComments,
  makeEntryIfAbsent,
} from "../utils/commentSlice";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

const Comments = ({ parentId, internal = false }) => {
  // console.log("inside the 'Comments' component");
  const [reply, setReply] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  dispatch(makeEntryIfAbsent({ parent: parentId }));
  let comments = useSelector((store) => store.comment.comments[parentId]);

  const [showAlert, setShowAlert] = useState(false);
  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showAlert]);

  // console.log("allComments : ", comments);

  let api = `http://localhost:4000/api/v1/advice/comments/${parentId}`;
  if (internal)
    api = `http://localhost:4000/api/v1/comment/replies/${parentId}`;

  useEffect(() => {
    if (comments.length === 0) {
      fetch(api, {
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          'Access-Control-Allow-Origin': 'true'
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.comments !== null && json.comments !== undefined) {
            dispatch(
              addMultipleComments({ comments: json.comments, parent: parentId })
            );
          }
        });
    }
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    if (isLoggedIn === false || isLoggedIn === null) {
      setShowAlert(true);
    } else {
      let url = `http://localhost:4000/api/v1/comment/create/${parentId}`;
      if (internal)
        url = `http://localhost:4000/api/v1/comment/reply/${parentId}`;

      const token = window.localStorage.getItem("token");
      fetch(url, {
        method: "POST",

        body: JSON.stringify({
          content: reply,
          token,
        }),

        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Access-Control-Allow-Origin': 'true'
        },
      })
        .then((response) => {
          if (response.status !== 200 && response.status !== 201) {
            navigate("./error", { state: { statusCode: response.status } });
          }
          return response.json();
        })

        .then((json) => {
          // console.log("newComment added successfully, json : ", json);
          dispatch(addComment({ comment: json.comment, parent: parentId }));
        })
        .catch((e) => {
          navigate("./error", { state: { statusCode: "" } });
        });

      setReply("");
    }
  };

  return (
    <div className="mx-6 border-l border-white">
      {showAlert && <Alert />}
      <div className={"text-white " + (internal ? "mr-0" : "")}>
        <form onSubmit={submitHandler} className="h-2/3 mt-2 ml-1">
          <textarea
            className="bg-slate-50 text-gray-900 rounded-lg leading-normal resize-none h-16 w-full font-medium placeholder-gray-700 focus:bg-white p-2"
            name="body"
            placeholder="Enter your comment here"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            required
          ></textarea>

          <div className="flex justify-between items-center">
            <p className="text-sm pt-px"> </p>
            <button
              type="submit"
              className="mb-1.5 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      <div className={"text-white " + (internal ? "mr-0" : "")}>
        {comments.map((comment, index) => (
          <Comment
            key={comment._id.toString()}
            data={comment}
            internal={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
