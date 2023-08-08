import { createSlice } from "@reduxjs/toolkit";

const tagSlice = createSlice({
  name: "tag",

  initialState: {
    allTags: [],
    selectedTags: {},
    tagsChanged: true,
  },

  reducers: {
    // setSelectedCount: (state, action) => {
    // state.selectedCount = action.payload;
    // },
    markChanged: (state) => {
      state.tagsChanged = true;
    },

    markUnchanged: (state) => {
      state.tagsChanged = false;
    },

    initializeTags: (state, action) => {
      state.allTags = action.payload;
      state.allTags.forEach((tag) => {
        state.selectedTags[tag._id.toString()] = 0;
      });
    },

    selectTags: (state, action) => {
      state.selectedTags = action.payload;
    },
  },
});

export const {
  markChanged,
  markUnchanged,
  initializeTags,
  selectTags,
  // setSelectedCount,
} = tagSlice.actions;
export default tagSlice.reducer;
