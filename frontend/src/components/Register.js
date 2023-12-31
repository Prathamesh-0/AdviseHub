import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import { initializeAdvicesForUser } from "../utils/adviceSlice";
import { initializeCommentsForUser } from "../utils/commentSlice";
import { logIn } from "../utils/userSlice";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const submitHandler = (event) => {
    event.preventDefault();
    setSubmitted(true);
    fetch("http://localhost:4000/api/v1/signup", {
      method: "POST",

      body: JSON.stringify({
        username,
        email,
        password,
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

      .then((data) => {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("isLoggedIn", true);
        window.localStorage.setItem("_id", data.user._id);
        window.localStorage.setItem("username", data.user.username);
        dispatch(logIn());
        dispatch(initializeAdvicesForUser());
        dispatch(initializeCommentsForUser());
        navigate("/");
      })
      .catch((e) => {
        navigate("./error", { state: { statusCode: "" } });
      });
  };

  if (submitted) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col py-[5vh] mx-auto h-[90vh] w-[27rem] overflow-scroll no-scrollbar">
      <div className="w-full rounded-lg bg-slate-300">
        <div className="px-10 py-6 my-6">
          <h1 className="text-xl font-bold text-gray-900 mb-8 text-center">
            Sign in to your account
          </h1>
          <form onSubmit={submitHandler}>
            <label
              htmlFor="username"
              className="block text-medium font-medium text-black-900 dark:text-white"
            >
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              className="bg-slate-50 text-gray-900 rounded-lg w-full p-3 mb-4"
              placeholder="Enter a valid username"
            />

            <label
              htmlFor="email"
              className="block text-medium font-medium text-black-900 dark:text-white"
            >
              Email address
            </label>
            <input
              required
              type="email"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              className="bg-slate-50 text-gray-900 rounded-lg w-full p-3 mb-6"
              placeholder="Enter a valid email address"
            />

            <label
              htmlFor="password"
              className="block text-medium font-medium text-black-900 dark:text-white"
            >
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              className="bg-slate-50 text-gray-900 rounded-lg w-full p-3 mb-6"
              placeholder="Enter password"
            />

            <button
              type="submit"
              className="my-2 w-full text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign up
            </button>

            <p className="text-sm font-light text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
