import React, { useState } from "react";
import Comments from "./Comments";
import { Link, useNavigate } from "react-router-dom";
import UpvoteDownvote from "./UpvoteDownvote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteComment, updateComment } from "../utils/commentSlice";
import { useDispatch, useSelector } from "react-redux";

const Comment = ({ data }) => {
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(data.content);

  const navigate = useNavigate();

  const id = data._id.toString();

  let user = data.userId.username || window.localStorage.getItem("username");
  let userId = data.userId._id || data.userId;
  userId = userId.toString(); // comment me specified userID

  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);

  const currentUserId = window.localStorage.getItem("_id");
  const belongsToCurrentUser = userId === currentUserId;

  const content = data.content;
  const replies = data.replies;

  const dispatch = useDispatch();

  const handleDelete = () => {
    const token = window.localStorage.getItem("token");
    fetch(`http://localhost:4000/api/v1/comment/${id}`, {
      method: "DELETE",

      body: JSON.stringify({
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
        // // console.log("recieved while deleting comment : ", json);
        // // console.log("comment's data : ", data);
        dispatch(deleteComment(data));
      })
      .catch((e) => {
        navigate("./error", { state: { statusCode: "" } });
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const token = window.localStorage.getItem("token");

    fetch(`http://localhost:4000/api/v1/comment/${data._id}`, {
      method: "PUT",

      body: JSON.stringify({
        token,
        content: newComment,
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
        // console.log("Edited json : ", json);
        dispatch(updateComment({ comment: json.comment }));
      })
      .catch((e) => {
        navigate("./error", { state: { statusCode: "" } });
      });

    setIsEditing(false);
  };

  if (isLoggedIn && isEditing) {
    return (
      <div>
        <div className="ml-2 h-2/3">
          <textarea
            className="bg-slate-50 text-gray-900 rounded-lg w-full p-3 py-4 leading-normal resize-none py-2 px-3 font-medium placeholder-gray-700 focus:bg-white"
            name="body"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            className="mx-2 px-4 py-1 bg-green-600 hover:bg-green-700 rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className=" px-4 py-1 bg-red-600 hover:bg-red-700 rounded-lg"
            onClick={() => setIsEditing(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-500 p-2 m-2 rounded-lg mb-0">
        <p className="pb-2 pl-1">
          <Link to={`./user/${userId}`}>
            <span className="font-semibold text-md">{user}</span>
          </Link>{" "}
          - {content}
        </p>
        {}
        <div className="flex justify-between">
          <span>
            <UpvoteDownvote
              parentId={id}
              initialScore={data.score}
              insideComment={true}
            />
            <button
              onClick={() => {
                setRepliesVisible(!repliesVisible);
              }}
            >
              <span className="px-2">
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </span>
            </button>
          </span>
          {isLoggedIn && belongsToCurrentUser && (
            <span className="pr-2 font-size-md">
              <button className="px-4" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} style={{ color: "green" }} />
              </button>
              <button onClick={() => handleDelete()}>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="trash-icon"
                  style={{ color: "orangered" }}
                />
              </button>
            </span>
          )}
        </div>
      </div>
      {repliesVisible && <Comments parentId={id} internal={true} />}

      {}
    </>
  );
};

export default Comment;
