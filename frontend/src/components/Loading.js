import React from "react";

const Loading = () => {
  console.log("inside loading");
  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <h1 className="text-4xl text-white mb-4">Loading...</h1>
      {/* <p className="text-lg text-gray-600 mb-6">{errorMessage}</p>
      <p className="text-gray-600">Error Code: {errorCode}</p> */}
    </div>
  );
};

export default Loading;
