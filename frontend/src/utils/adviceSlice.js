import { createSlice } from "@reduxjs/toolkit";

const adviceSlice = createSlice({
  name: "advice",

  initialState: {
    choice: 0,
    topHasMoreData: true,
    latestHasMoreData: true,
    topAdvices: [],
    latestAdvices: [],
    isUpvotedByCurrentUser: {},
    isDownvotedByCurrentUser: {},
    isHidden: {},
  },

  reducers: {
    initializeAdvicesForUser: (state) => {
      let currentUserId = window.localStorage.getItem("_id");

      state.topAdvices.forEach((advice) => {
        if (currentUserId !== null && currentUserId !== undefined) {
          let upvoted = 0;
          advice.upvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) upvoted = 1;
          });
          state.isUpvotedByCurrentUser[advice._id.toString()] = upvoted;

          let downvoted = 0;
          advice.downvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) downvoted = 1;
          });
          state.isDownvotedByCurrentUser[advice._id.toString()] = downvoted;
        }
      });

      state.latestAdvices.forEach((advice) => {
        if (currentUserId !== null && currentUserId !== undefined) {
          let upvoted = 0;
          advice.upvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) upvoted = 1;
          });
          state.isUpvotedByCurrentUser[advice._id.toString()] = upvoted;

          let downvoted = 0;
          advice.downvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) downvoted = 1;
          });
          state.isDownvotedByCurrentUser[advice._id.toString()] = downvoted;
        }
      });
    },

    showTop: (state) => {
      state.choice = 1;
    },

    showLatest: (state) => {
      state.choice = 0;
    },

    markTopFinished: (state) => {
      state.topHasMoreData = false;
    },
    markLatestFinished: (state) => {
      state.latestHasMoreData = false;
    },
    unmarkTopFinished: (state) => {
      state.topHasMoreData = true;
    },
    unmarkLatestFinished: (state) => {
      state.latestHasMoreData = true;
    },

    upvoteAdvice: (state, action) => {
      const adviceId = action.payload.parentId.toString();
      state.isUpvotedByCurrentUser[adviceId] =
        1 - state.isUpvotedByCurrentUser[adviceId];
      if (state.isDownvotedByCurrentUser[adviceId] === 1)
        state.isDownvotedByCurrentUser[adviceId] = 0;
    },

    downvoteAdvice: (state, action) => {
      // // console.log("action.payload.parentId : ", action.payload.parentId);
      const adviceId = action.payload.parentId.toString();
      state.isDownvotedByCurrentUser[adviceId] =
        1 - state.isDownvotedByCurrentUser[adviceId];
      if (state.isUpvotedByCurrentUser[adviceId] === 1)
        state.isUpvotedByCurrentUser[adviceId] = 0;
    },

    addAdvice: (state, action) => {
      const currentUsername = window.localStorage.getItem("username");
      const currentUserId = window.localStorage.getItem("_id");
      state.latestAdvices.unshift({
        ...action.payload.advice,
        userId: { username: currentUsername, _id: currentUserId },
      });
      state.isUpvotedByCurrentUser[action.payload.advice._id] = 0;
      state.isDownvotedByCurrentUser[action.payload.advice._id] = 0;
      state.topAdvices.push(action.payload.advice);
    },

    addTopAdvices: (state, action) => {
      // console.log("Top action.payload.advices", action.payload.advices);
      let currentUserId = window.localStorage.getItem("_id");

      action.payload.advices.forEach((advice) => {
        // marking hidden
        if (!(advice._id.toString() in state.isHidden))
          state.isHidden[advice._id.toString()] = 0;

        // handling upvote, downvote stuff
        if (currentUserId !== null && currentUserId !== undefined) {
          let upvoted = 0;
          advice.upvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) upvoted = 1;
          });
          state.isUpvotedByCurrentUser[advice._id.toString()] = upvoted;

          let downvoted = 0;
          advice.downvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) downvoted = 1;
          });
          state.isDownvotedByCurrentUser[advice._id.toString()] = downvoted;
        }
      });
      if (action.payload.advices !== null)
        state.topAdvices.push(...action.payload.advices);
    },

    addLatestAdvices: (state, action) => {
      // // console.log("Latest action.payload.advices", action.payload.advices);
      let currentUserId = window.localStorage.getItem("_id");
      action.payload.advices.forEach((advice) => {
        // marking hidden
        if (!(advice._id.toString() in state.isHidden))
          state.isHidden[advice._id.toString()] = 0;

        if (currentUserId !== null && currentUserId !== undefined) {
          // handling upvote, downvote stuff
          let upvoted = 0;
          advice.upvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) upvoted = 1;
          });
          state.isUpvotedByCurrentUser[advice._id.toString()] = upvoted;

          let downvoted = 0;
          advice.downvotes.forEach((userId) => {
            if (userId.toString() === currentUserId.toString()) downvoted = 1;
          });
          state.isDownvotedByCurrentUser[advice._id.toString()] = downvoted;
        }
      });
      if (action.payload.advices !== null)
        state.latestAdvices.push(...action.payload.advices);
    },

    handleUpvoteEvent: (state, action) => {
      state.topAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.adviceId.toString()) {
          let alreadyUpvoted = false;
          advice.upvotes.forEach((userId, index) => {
            if (userId.toString() === action.payload.userId.toString()) {
              advice.upvotes.splice(index, 1);
              alreadyUpvoted = true;
            }
          });
          if (!alreadyUpvoted) {
            advice.upvotes.push(action.payload.userId.toString());
          }
        }
      });

      state.topAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.adviceId.toString()) {
          advice.downvotes.forEach((userId, index) => {
            if (userId.toString() === action.payload.userId.toString()) {
              advice.downvotes.splice(index, 1);
            }
          });
        }
      });
    },

    handleDownvoteEvent: (state, action) => {
      state.topAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.adviceId.toString()) {
          let alreadyDownvoted = false;
          advice.downvotes.forEach((userId, index) => {
            if (userId.toString() === action.payload.userId.toString()) {
              advice.downvotes.splice(index, 1);
              alreadyDownvoted = true;
            }
          });
          if (!alreadyDownvoted) {
            advice.downvotes.push(action.payload.userId.toString());
          }
        }
      });

      state.topAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.adviceId.toString()) {
          advice.upvotes.forEach((userId, index) => {
            if (userId.toString() === action.payload.userId.toString()) {
              advice.upvotes.splice(index, 1);
            }
          });
        }
      });
    },

    deleteAdvice: (state, action) => {
      // // console.log(
      //   "In delete -> action.payload.toString() : ",
      //   action.payload.toString()
      // );
      state.topAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.toString()) {
          state.topAdvices.splice(index, 1);
        }
      });
      state.latestAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.toString()) {
          state.latestAdvices.splice(index, 1);
        }
      });
    },

    clearTopAdvices: (state) => {
      state.topAdvices = [];
    },

    clearLatestAdvices: (state) => {
      state.latestAdvices = [];
    },
    updateAdvice: (state, action) => {
      state.topAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.advice._id.toString()) {
          state.topAdvices[index] = {
            ...action.payload.advice,
            userId: state.topAdvices[index].userId,
          };
        }
      });
      state.latestAdvices.forEach((advice, index) => {
        if (advice._id.toString() === action.payload.advice._id) {
          state.latestAdvices[index] = {
            ...action.payload.advice,
            userId: state.latestAdvices[index].userId,
          };
        }
      });
    },
  },
});

export const {
  markLatestFinished,
  markTopFinished,
  updateAdvice,
  addAdvice,
  unmarkLatestFinished,
  unmarkTopFinished,
  initializeAdvicesForUser,
  addTopAdvices,
  addLatestAdvices,
  upvoteAdvice,
  downvoteAdvice,
  handleUpvoteEvent,
  handleDownvoteEvent,
  deleteAdvice,
  clearTopAdvices,
  clearLatestAdvices,
  showTop,
  showLatest,
} = adviceSlice.actions;
export default adviceSlice.reducer;
