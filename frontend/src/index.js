import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PickTags from "./components/PickTags";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Register from "./components/Register";
import NewAdvice from "./components/NewAdvice";
import SidebarNav from "./components/SidebarNav";
import UserProfile from "./components/UserProfile";
import Leaderboard from "./components/Leaderboard";
import Error from "./components/Error";

const root = ReactDOM.createRoot(document.getElementById("root"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <SidebarNav />
            <Body />
          </>
        ),
      },
      { path: "/pickTags", element: <PickTags /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/newAdvice", element: <NewAdvice /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      { path: "/user/:id", element: <UserProfile /> },
      { path: "/*", element: <Error /> },
    ],
  },
]);

root.render(<RouterProvider router={appRouter} />);

reportWebVitals();
