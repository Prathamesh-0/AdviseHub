const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  selfProfile,
  getUserInfoAndAdvices,
  getLeaderboard,
  getTop10Users,
  recommend,
} = require("../controllers/user.js");
const User = require("../models/User");
const { auth } = require("../middlewares/auth.js");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", auth, selfProfile); // FRONTEND REMAINING
router.get("/user/:id", getUserInfoAndAdvices);
router.get("/topUsers", getTop10Users);
router.get("/recommend/:prefix", recommend);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
