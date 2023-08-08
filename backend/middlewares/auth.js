const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  // console.log("req : ", req);
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("payload : ", payload);
      try {
        req.user = await User.findById(payload.id);
        // temp= async()=>{
        //   var c=await User.findById(payload.id);
        //   console.log("in auth : ", req.user);
        // }
        // temp();
        // console.log("in auth : ", req.user);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
          // message: "Error in fetching user data from DB",
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong, while verifying the token",
      error: error.message,
    });
  }
};
