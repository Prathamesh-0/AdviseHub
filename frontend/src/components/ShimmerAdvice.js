import React from "react";

const ShimmerAdvice = () => {
  return (
    <div className="bg-slate-300 p-4 shadow-md rounded-xl w-[90vw] ml-2 md:w-[62.5vw] lg:w-[66vw] md:ml-3 my-2">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-2 py-1">
          <div className="flex">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="ml-2 h-4 bg-gray-200 rounded w-1/12"></div>
          </div>
          <div className="space-y-2">
            <div className="h-14 bg-gray-200 rounded m-3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerAdvice;
