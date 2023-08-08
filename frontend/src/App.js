import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import "./index.css";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/store";

function App() {
  return (
    <Provider store={store}>
      <div className="overflow-scroll no-scrollbar bg-black min-h-screen min-w-screen">
        <Navbar />
        <div className="flex justify-center min-h-full max-h-full">
          <Outlet />
        </div>
        <div className=" h-0"></div>
      </div>
    </Provider>
  );
}

export default App;
