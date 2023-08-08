import React, { useState } from "react";
import Comments from "./Comments";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getTimeDifferenceFromTimestamp } from "../utils/helperFunctions";
import { deleteAdvice, updateAdvice } from "../utils/adviceSlice";
import UpvoteDownvote from "./UpvoteDownvote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";

const Advice = ({ advice }) => {
  // console.log("advice : ", advice);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAdvice, setNewAdvice] = useState(advice.content);

  const isLoggedIn = useSelector((store) => store.user.isLoggedIn);

  const tags = useSelector((store) => store.tag.allTags);
  const temp = {};

  // console.log("tags : ", tags);

  // console.log("advice tags : ", advice.tags);
  tags.forEach((tag) => {
    let tagPresent = 0;
    advice.tags.forEach((selectedTag) => {
      // const id = selectedTag._id || selectedTag;
      // console.log(id);
      if ((selectedTag._id || selectedTag) === tag._id) {
        tagPresent = 1;
      }
    });
    temp[tag._id.toString()] = tagPresent;
  });
  const [selectedTags, setSelectedTags] = useState(temp);
  const navigate = useNavigate();
  // console.log("selectedTags : ", selectedTags);

  const currentUserId = window.localStorage.getItem("_id");
  const belongsToCurrentUser = currentUserId === advice.userId._id;
  const dispatch = useDispatch();

  let time = getTimeDifferenceFromTimestamp(advice.createdAt);

  const handleDelete = () => {
    const token = window.localStorage.getItem("token");
    fetch(`http://localhost:4000/api/v1/advice/${advice._id}`, {
      // Adding method type
      method: "DELETE",

      // Adding body or contents to send
      body: JSON.stringify({
        token,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Access-Control-Allow-Origin': 'true'
      },
    })
      // Converting to JSON
      .then((response) => {
        // // console.log("response : ", response);
        if (response.status !== 200 && response.status !== 201) {
          navigate("./error", { state: { statusCode: response.status } });
        }
        return response.json();
      })

      // Displaying results to console
      .then((json) => {
        // // console.log(json);
        // // console.log("newAdvice json : ", json);
        dispatch(deleteAdvice(advice._id));
        // dispatch(addAdvices(json));
        // dispatch(addAdvices(["new TE T"]));
      })
      .catch((e) => {
        navigate("./error", { state: { statusCode: "" } });
      });
  };

  const submitHandler = () => {
    // event.preventDefault();
    const token = window.localStorage.getItem("token");
    const tags = [];
    for (const tagId in selectedTags) {
      if (selectedTags[tagId]) {
        tags.push(tagId.toString());
      }
    }
    fetch(`http://localhost:4000/api/v1/advice/${advice._id}`, {
      // Adding method type
      method: "PUT",

      // Adding body or contents to send
      body: JSON.stringify({
        token,
        content: newAdvice,
        tags,
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Access-Control-Allow-Origin': 'true'
      },
    })
      // Converting to JSON
      .then((response) => {
        // // console.log("response : ", response);
        if (response.status !== 200 && response.status !== 201) {
          navigate("./error", { state: { statusCode: response.status } });
        }
        return response.json();
      })

      // Displaying results to console
      .then((json) => {
        // // console.log(json);
        // console.log("Edited json : ", json);
        dispatch(updateAdvice({ advice: json.advice }));
        // dispatch(addAdvices(json));
        // dispatch(addAdvices(["new TE T"]));
      })
      .catch((e) => {
        navigate("./error", { state: { statusCode: "" } });
      });

    setIsEditing(false);
  };

  const handleTagClick = (tagId) => {
    setSelectedTags({
      ...selectedTags,
      [tagId]: 1 - selectedTags[tagId],
    });
    // // console.log("selectedTags : ", selectedTags);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoggedIn && isEditing) {
    // console.log("advice : ", advice);
    // console.log("selected Tags : ", selectedTags);
    return (
      <div className="m-2 p-2 p-4 rounded-xl bg-slate-300 shadow-md mb-0 w-[83vw] md:w-[64vw]">
        <div className="px-3 py-2 p-4">
          <div className="h-2/3">
            <textarea
              className="bg-slate-50 text-gray-900 rounded-lg w-full p-3 py-4 leading-normal resize-none py-2 px-3 font-medium placeholder-gray-700 focus:bg-white"
              name="body"
              value={newAdvice}
              onChange={(event) => setNewAdvice(event.target.value)}
              required
            ></textarea>
            <div className=" rounded-2xl px-2 py-1 flex flex-row justify-center items-center">
              <div className="bg-black justify-center p-1 items-center rounded-xl text-green-300 px-2">
                {" "}
                Tags:{" "}
              </div>
              <div className="ml-2 flex flex-row overflow-scroll no-scrollbar rounded-3xl">
                {tags.map((tag) => {
                  return (
                    <div
                      onClick={() => {
                        handleTagClick(tag._id);
                      }}
                      key={tag._id}
                      className={`${
                        selectedTags[tag._id.toString()]
                          ? "bg-green-900 hover:bg-green-600"
                          : "bg-black hover:bg-green-500"
                      } text-neutral-50 px-3 rounded-lg m-1 border-2 border-green-400 flex flex-nowrap items-center`}
                    >
                      <FontAwesomeIcon icon={faTag} flip="horizontal" />
                      <span className="pl-2">{tag.tagName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end items-center mt-1">
              <button
                onClick={submitHandler}
                className="mx-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-1.5 text-center"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
                className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-1.5 text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="m-2 p-2 rounded-xl bg-slate-300 shadow-md mb-0">
        <Link to={`/user/${advice.userId._id}`}>
          <span className="font-semibold">
            {advice.userId.username === undefined
              ? "You"
              : advice.userId.username}
          </span>
        </Link>
        <span className="font-thin text-gray-500">
          {" "}
          • {time.hours ? `${time.hours} hours` : `${time.minutes} min.`} ago
        </span>
        <p className="break-words m-1 p-2 pl-3 ml-2 border-l-2 border-gray-800 text-xl font-light">
          {advice.content}
        </p>
        <div className="flex justify-between">
          <span>
            <UpvoteDownvote parentId={advice._id} initialScore={advice.score} />
            <button
              onClick={() => {
                setCommentsVisible(!commentsVisible);
              }}
            >
              <span className="px-2">{advice.comments.length} comments</span>
            </button>
          </span>
          {isLoggedIn && belongsToCurrentUser && (
            <span className="pr-2 font-size-md">
              <button className="px-4" onClick={() => handleEdit()}>
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
      {commentsVisible && <Comments parentId={advice._id} />}
    </>
  );
};

export default Advice;
