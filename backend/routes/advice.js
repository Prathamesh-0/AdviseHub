const express = require("express");
const {
  advise,
  deleteAdvice,
  upvoteAdvice,
  downvoteAdvice,
  commentOnAdvice,
  replyToComment,
  upvoteComment,
  downvoteComment,
  deleteComment,
  updateAdvice,
  updateComment,
  getLatestAdvices,
  getTopScoredAdvices,
  getTopScoredCommentsToAdvice,
  getTopScoredRepliesToComment,
  getTags,
  getLatestAdvicesByTags,
  getTopScoredAdvicesByTags,
  handleVotes,
} = require("../controllers/advice.js");

const { auth } = require("../middlewares/auth.js");
const router = express.Router();

router.route("/advice/advise").post(auth, advise); // Done
router.route("/advice/upvote/:id").post(auth, upvoteAdvice); // Done
router.route("/advice/downvote/:id").post(auth, downvoteAdvice); // Done
router.route("/advice/:id").delete(auth, deleteAdvice); // Done
router.route("/advice/:id").put(auth, updateAdvice); // Done
router.route("/advice/latest/:page").get(getLatestAdvices); // Done
router.route("/advice/top/:page").get(getTopScoredAdvices); // Done
router.route("/advice/latest/").get(getLatestAdvices); // Done
router.route("/advice/top/").get(getTopScoredAdvices); // Done
router.route("/advice/comments/:id").get(getTopScoredCommentsToAdvice); // Done
router.route("/advice/byTags/top/").get(getTopScoredAdvicesByTags); // Done
router.route("/advice/byTags/latest/").get(getLatestAdvicesByTags); // Done
router.route("/advice/handleVotes/:id").post(auth, handleVotes); // to be integrate

router.route("/comment/create/:id").post(auth, commentOnAdvice); // Done
router.route("/comment/reply/:id").post(auth, replyToComment); // Done
router.route("/comment/upvote/:id").post(auth, upvoteComment); // Done
router.route("/comment/downvote/:id").post(auth, downvoteComment); // Done
router.route("/comment/:id").delete(auth, deleteComment); // Done
router.route("/comment/:id").put(auth, updateComment); // Done
router.route("/comment/replies/:id").get(getTopScoredRepliesToComment); // Done


router.route("/tags").get(getTags); // Done

module.exports = router;
