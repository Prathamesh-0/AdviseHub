import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { markChanged, selectTags } from "../utils/tagSlice";

const PickTags = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tags = useSelector((store) => store.tag.allTags);
  const before = useSelector((store) => store.tag.selectedTags);
  const [selectedTags, setSelectedTags] = useState(
    useSelector((store) => store.tag.selectedTags)
  );

  const handleTagClick = (id) => {
    setSelectedTags({
      ...selectedTags,
      [id.toString()]: 1 - selectedTags[id.toString()],
    });
  };

  const submitHandler = () => {
    const now = selectedTags;
    if (JSON.stringify(now) !== JSON.stringify(before)) {
      dispatch(selectTags(now));
      dispatch(markChanged());
    }

    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center w-9/12 my-auto items-center h-[90vh]">
      <div className="my-auto mx-[20vw] flex flex-wrap">
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
              } text-neutral-50 px-3 rounded-lg m-1 border-2 border-green-400`}
            >
              <FontAwesomeIcon icon={faTag} flip="horizontal" />
              <span className="pl-2">{tag.tagName}</span>
            </div>
          );
        })}
      </div>
      <button
        onClick={submitHandler}
        type="submit"
        className=" my-1.5 w-1/3 text-white bg-green-700 hover:bg-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Explore
      </button>
    </div>
  );
};

export default PickTags;
