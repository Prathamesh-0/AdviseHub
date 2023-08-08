import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",

  initialState: {
    recommendations: {},
  },

  reducers: {
    addEntry: (state, action) => {
      state.recommendations = {
        ...state.recommendations,
        [action.payload.key]: action.payload.value,
      };
    },
  },
});

export const { addEntry } = searchSlice.actions;
export default searchSlice.reducer;
