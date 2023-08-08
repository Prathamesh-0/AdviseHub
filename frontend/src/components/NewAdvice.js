import React, { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addAdvice } from "../utils/adviceSlice";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Alert from "./Alert";

const NewAdvice = () => {
  const [advice, setAdvice] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tags = useSelector((store) => store.tag.allTags);

  const temp = {};
  tags.forEach((tag) => {
    temp[tag._id.toString()] = 0;
  });
  const [selectedTags, setSelectedTags] = useState(temp);
  const globalSelectedTags = useSelector((store) => store.tag.selectedTags);

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

  const submitHandler = (event) => {
    event.preventDefault();
    if (isLoggedIn === false || isLoggedIn === null) {
      setShowAlert(true);
    } else {
      setSubmitted(true);
      const token = window.localStorage.getItem("token");

      const tagIds = [];
      let shouldBeIncludedInHomePage = 0;
      if (tagIds.length === 0) shouldBeIncludedInHomePage = 1;
      for (const tagId in selectedTags) {
        if (selectedTags[tagId]) {
          if (globalSelectedTags[tagId]) shouldBeIncludedInHomePage = 1;
          tagIds.push(tagId.toString());
        }
      }

      fetch("http://localhost:4000/api/v1/advice/advise", {
        method: "POST",

        body: JSON.stringify({
          content: advice,
          tags: tagIds,
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
          // console.log("newAdvice json : ", json);
          if (
            shouldBeIncludedInHomePage &&
            json.advice !== null &&
            json.advice !== undefined
          ) {
            dispatch(addAdvice({ advice: json.advice }));
          }
          navigate("/");
        })
        .catch((e) => {
          navigate("./error", { state: { statusCode: "" } });
        });
    }
  };

  const handleTagClick = (id) => {
    setSelectedTags({
      ...selectedTags,
      [id.toString()]: 1 - selectedTags[id.toString()],
    });
  };

  if (submitted) {
    return <Loading />;
  }
  return (
    <div className="pb-4 flex flex-col mx-auto overflow-scroll no-scrollbar md:px-[5vw] lg:px-[15vw] md:w-[90vw] w-[80vw] pt-[8vh]">
      {showAlert && <Alert />}
      <div className="text-3xl text-green-500  font-bold rounded-lg w-full">
        Plant seeds of guidance, harvest a world of empowered souls.
      </div>
      <div className="w-full rounded-lg bg-slate-300">
        <div className="px-10 py-12">
          <h1 className="text-center text-xl font-bold text-gray-900">
            Advise :
          </h1>
          <br />
          <form onSubmit={submitHandler} className="h-2/3">
            <textarea
              className="bg-slate-50 text-gray-900 rounded-lg w-full p-3 leading-normal resize-none h-40 py-2 px-3 font-medium placeholder-gray-700 focus:bg-white"
              name="body"
              placeholder="Kindly keep it short and sweet"
              onChange={(event) => setAdvice(event.target.value)}
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
            <br />
            <div className="flex justify-between items-center">
              <p className="text-sm pt-px">Kindly keep it short and sweet.</p>
              <button
                type="submit"
                className=" my-1.5 w-1/3 text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Advise
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAdvice;
