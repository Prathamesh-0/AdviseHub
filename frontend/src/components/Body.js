import React, { useRef, useState } from "react";
import Advice from "./Advice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  addTopAdvices,
  addLatestAdvices,
  clearTopAdvices,
  clearLatestAdvices,
  showLatest,
  showTop,
  unmarkLatestFinished,
  unmarkTopFinished,
  markTopFinished,
  markLatestFinished,
} from "../utils/adviceSlice";
import { markUnchanged } from "../utils/tagSlice";
import ShimmerAdvice from "./ShimmerAdvice";

const Body = () => {
  const topAdvices = useSelector((store) => store.advice.topAdvices);
  const latestAdvices = useSelector((store) => store.advice.latestAdvices);
  const choice = useSelector((store) => store.advice.choice);
  const haveTagsChanged = useSelector((store) => store.tag.tagsChanged);
  const selectedTags = useSelector((store) => store.tag.selectedTags);
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const [topPage, setTopPage] = useState(1);
  const [latestPage, setLatestPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const topHasMoreData = useSelector((state) => state.advice.topHasMoreData);
  const latestHasMoreData = useSelector(
    (state) => state.advice.latestHasMoreData
  );

  useEffect(() => {
    // console.log("in useEffect");
    if ((choice && !topHasMoreData) || (!choice && !latestHasMoreData)) {
      return; // No need to fetch more data if there's nothing more to fetch
    }

    // Simulating fetching data from an API.
    // Replace this with your actual data fetching logic.
    const fetchData = () => {
      setLoading(true);
      fetchMoreData(choice ? topPage : latestPage) // Replace 'fetchMoreData' with your data fetching function.
        .then((newAdvices) => {
          // console.log("newAdvices :", newAdvices);
          if (newAdvices.advices.length === 0) {
            // If there's no more data, update the 'hasMoreData' state to stop further fetching.

            if (choice) {
              // setTopHasMoreData(false);
              dispatch(markTopFinished());
            } else {
              dispatch(markLatestFinished());
              // setLatestHasMoreData(false);
            }
          } else {
            // setTopAdvices((prevAdvices) => [...prevAdvices, ...newAdvices]);
            choice
              ? dispatch(addTopAdvices(newAdvices))
              : dispatch(addLatestAdvices(newAdvices));
            choice
              ? setTopPage((prevPage) => prevPage + 1)
              : setLatestPage((prevPage) => prevPage + 1);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);

          // agar error aayi toh bol do simply ki no more data
          if (choice) {
            // setTopHasMoreData(false);
            dispatch(markTopFinished());
          } else {
            dispatch(markLatestFinished());
            // setLatestHasMoreData(false);
          }
        });
    };

    // Creating the IntersectionObserver.
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        // Load more data when the target element becomes visible.
        fetchData();
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    dispatch(markUnchanged());

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [topPage, latestPage, topHasMoreData, latestHasMoreData, choice]);

  useEffect(() => {
    if (haveTagsChanged) {
      dispatch(clearLatestAdvices());
      dispatch(clearTopAdvices());
      setTopPage(1);
      setLatestPage(1);
      dispatch(unmarkLatestFinished());
      dispatch(unmarkTopFinished());
      // setTopHasMoreData(1);
      // setLatestHasMoreData(1);
      dispatch(markUnchanged());
    }
  }, [haveTagsChanged]);
  // Simulating fetching data from an API.
  // Replace this function with your actual data fetching logic.
  const fetchMoreData = async (currentPage) => {
    // console.log("currentPage : ", currentPage);
    const tagIds = [];
    for (const tagId in selectedTags) {
      if (selectedTags[tagId]) {
        tagIds.push(tagId.toString());
      }
    }
    if (tagIds.length) {
      const queryParams = new URLSearchParams({
        page: currentPage,
        tags: tagIds.join(","),
      });

      let response = await fetch(
        choice
          ? `http://localhost:4000/api/v1/advice/byTags/top?${queryParams}`
          : `http://localhost:4000/api/v1/advice/byTags/latest?${queryParams}`
      , {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Access-Control-Allow-Origin': 'true'
      },
    });

      const data = await response.json();
      // console.log("fetched these tagged advices, : ", data);
      return data;
    }

    let response = await fetch(
      choice
        ? `http://localhost:4000/api/v1/advice/top/${currentPage}`
        : `http://localhost:4000/api/v1/advice/latest/${currentPage}`
    , {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Access-Control-Allow-Origin': 'true'
      },
    });

    const data = await response.json();
    // console.log("fetched these un-tagged advices, : ", data);
    return data;
  };

  return (
    <div
      className={`inset-0 ${
        false ? "pointer-events-none" : ""
      } h-[91vh] pb-2  w-[100vw]`}
    >
      <div className="pt-3 px-6 pb-4 w-full">
        <div className="flex cursor-pointer">
          <div
            onClick={() => dispatch(showLatest())}
            className={`w-1/2 ${
              choice === 0 ? "bg-slate-600" : ""
            } flex justify-center py-2 text-white rounded-l-lg`}
          >
            Latest
          </div>
          <div
            onClick={() => dispatch(showTop())}
            className={`w-1/2 ${
              choice === 1 ? "bg-slate-600" : ""
            } flex justify-center py-2 text-white rounded-r-lg`}
          >
            Top
          </div>
        </div>
        <div className="h-[81vh] overflow-x-hidden mt-2">
          {choice ? (
            topAdvices.map((advice, index) => (
              <Advice key={advice._id} advice={advice} />
            ))
          ) : (
            <></>
          )}
          {!choice ? (
            latestAdvices.map((advice, index) => (
              <Advice key={advice._id} advice={advice} />
            ))
          ) : (
            <></>
          )}

          <div ref={containerRef}></div>
          {choice && topHasMoreData ? (
            <>
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
            </>
          ) : (
            <></>
          )}
          {!choice && latestHasMoreData ? (
            <>
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
            </>
          ) : (
            <></>
          )}
          {loading && (
            <div>
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
              <ShimmerAdvice />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
