import { configureStore } from "@reduxjs/toolkit";
import adviceSlice from "./adviceSlice";
import userSlice from "./userSlice";
import commentSlice from "./commentSlice";
import tagSlice from "./tagSlice";
import searchSlice from "./searchSlice";

const store = configureStore({
  reducer: {
    advice: adviceSlice,
    user: userSlice,
    comment: commentSlice,
    tag: tagSlice,
    search: searchSlice,
  },
});

export default store;
