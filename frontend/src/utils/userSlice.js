import { createSlice } from "@reduxjs/toolkit";

const isLoggedIn = window.localStorage.getItem("isLoggedIn");
const userSlice = createSlice({
  name: "user",

  initialState: {
    isLoggedIn: isLoggedIn,
    topUsers: [],
  },

  reducers: {
    addTopUsers: (state, action) => {
      state.topUsers = action.payload.users;
    },

    logOut: (state) => {
      state.isLoggedIn = false;
    },

    logIn: (state) => {
      state.isLoggedIn = true;
    },
  },
});

export const { addTopUsers, logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
