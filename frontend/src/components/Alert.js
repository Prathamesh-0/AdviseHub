import React from "react";
import { Link } from "react-router-dom";

const Alert = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow py-7">
        <p className="p-2 font-bold">Seems like you are not logged in.</p>
        <div className="flex items-center justify-between pt-4 px-4">
          <Link
            to="/login"
            className="mt-4 px-5 py-1 bg-green-500 text-white rounded"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="mt-4 px-3 py-1 bg-green-500 text-white rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Alert;
