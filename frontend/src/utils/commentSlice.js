import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",

  initialState: {
    comments: {},
    isUpvotedByCurrentUser: {},
    isDownvotedByCurrentUser: {},
  },

  reducers: {
    // initializeForParent: (state, action) => {
    // if (!(action.payload.parentId in state.comments)) {
    //   state.comments[action.payload.parentId] = [];
    // }
    // },

    initializeCommentsForUser: (state) => {
      let currentUserId = window.localStorage.getItem("_id");

      for (const comment in state.comments) {
        if (currentUserId !== null && currentUserId !== undefined) {
          let upvoted = 0;
          comment.upvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) upvoted = 1;
          });
          state.isUpvotedByCurrentUser[comment._id.toString()] = upvoted;

          let downvoted = 0;
          comment.downvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) downvoted = 1;
          });
          state.isDownvotedByCurrentUser[comment._id.toString()] = downvoted;
        }
      }
    },

    upvoteComment: (state, action) => {
      const adviceId = action.payload.parentId.toString();
      state.isUpvotedByCurrentUser[adviceId] =
        1 - state.isUpvotedByCurrentUser[adviceId];
      if (state.isUpvotedByCurrentUser[adviceId] === 1)
        state.isDownvotedByCurrentUser[adviceId] = 0;
    },

    downvoteComment: (state, action) => {
      // // console.log("action.payload.adviceId : ", action.payload.adviceId);
      const adviceId = action.payload.parentId.toString();
      state.isDownvotedByCurrentUser[adviceId] =
        1 - state.isDownvotedByCurrentUser[adviceId];
      if (state.isDownvotedByCurrentUser[adviceId] === 1)
        state.isUpvotedByCurrentUser[adviceId] = 0;
    },

    makeEntryIfAbsent: (state, action) => {
      const parent = action.payload.parent.toString();
      if (!state.comments.hasOwnProperty(parent)) {
        state.comments[parent] = [];
      }
    },

    addMultipleComments: (state, action) => {
      const parent = action.payload.parent.toString();
      let currentUserId = window.localStorage.getItem("_id");

      if (!state.comments.hasOwnProperty(parent)) {
        state.comments[parent] = [];
      }

      action.payload.comments.forEach((comment) => {
        if (parent !== null && parent !== undefined) {
          state.comments[parent].push(comment);
        }

        if (!(comment._id.toString() in state.comments)) {
          state.comments[comment._id.toString()] = [];
        }

        let upvoted = 0;
        comment.upvotes.forEach((userId) => {
          if (userId.toString() === currentUserId) {
            upvoted = 1;
          }
        });
        state.isUpvotedByCurrentUser[comment._id.toString()] = upvoted;
        let downvoted = 0;
        comment.downvotes.forEach((userId) => {
          if (userId.toString() === currentUserId) {
            downvoted = 1;
          }
        });
        state.isDownvotedByCurrentUser[comment._id.toString()] = downvoted;
      });
    },

    addComment: (state, action) => {
      const comment = action.payload.comment;
      const parent = action.payload.parent;

      if (!(comment._id.toString() in state.comments)) {
        state.comments[comment._id.toString()] = [];
      }

      state.isDownvotedByCurrentUser[comment._id.toString()] = 0;
      state.isUpvotedByCurrentUser[comment._id.toString()] = 0;

      if (parent !== null && parent !== undefined) {
        state.comments[parent].unshift(comment);
      }
    },

    deleteComment: (state, action) => {
      const comment = action.payload;
      let parent = comment.adviceId;
      if (parent === null || parent === undefined)
        parent = comment.parentComment;

      if (parent !== undefined && parent !== null) {
        parent = parent.toString();
        // // console.log("parent : ", parent);
        // // console.log("state.comments[parent] : ", state.comments[parent]);
        let ind = -1;
        for (let i = 0; i < state.comments[parent].length; i++) {
          if (
            state.comments[parent][i]._id.toString() === comment._id.toString()
          ) {
            ind = i;
            break;
          }
        }
        if (ind >= 0) state.comments[parent].splice(ind, 1);
      }
    },

    clearAllComments: (state) => {
      state.comments = {};
    },

    updateComment: (state, action) => {
      const comment = action.payload.comment;
      let parent = comment.adviceId;
      if (parent === null || parent === undefined)
        parent = comment.parentComment;

      if (parent !== undefined && parent !== null) {
        state.comments[parent].forEach((commentItem, index) => {
          if (commentItem._id === comment._id)
            state.comments[parent][index] = comment;
        });
      }
    },
  },
});

export const {
  // initializeForParent,
  initializeCommentsForUser,
  updateComment,
  addMultipleComments,
  upvoteComment,
  downvoteComment,
  addComment,
  deleteComment,
  clearAllComments,
  makeEntryIfAbsent,
} = commentSlice.actions;
export default commentSlice.reducer;
