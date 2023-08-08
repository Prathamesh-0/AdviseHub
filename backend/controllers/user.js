const User = require("../models/User");
const Advice = require("../models/Advice");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  initializeTrie,
  convertToLowerCase,
} = require("../utils/helperFunctions");

let trie = null;

exports.signup = async (req, res) => {
  try {
    // // console.log("start", req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(500).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    const existingUser = await User.findOne({ email });

    // // console.log("existingUser : ", existingUser);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }

    // // console.log("mid");

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing Password",
      });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // // console.log("mid1");

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    // // console.log("end");
    if (trie !== null) trie.insert(user.username, user._id);

    // // console.log("token : ", token);

    res.status(201).cookie("token", token, options).json({
      success: true,
      message: "Successfully signed up",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Signup failed!!!",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or passord can not be NULL",
      });
    }

    //check for registered user
    let user = await User.findOne({ email }).select("+password");
    //if not a registered user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You need to Sign up first",
      });
    }

    const payload = {
      id: user._id,
    };
    //verify password & generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      //password match
      let token = jwt.sign(payload, process.env.JWT_SECRET);

      // user = user.toObject();
      // user.token = token;
      // user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Logged in successfully",
      });

      // res.status(200).json({
      //     success:true,
      //     token,
      //     user,
      //     message:'User Logged in successfully',
      // });
    } else {
      //passwsord do not match
      return res.status(403).json({
        success: false,
        message: "Password Incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login Failure",
    });
  }
};

exports.logout = (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged Out Successfully!!",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

exports.selfProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("advices");

    res.status(200).json({
      success: true,
      user,
      message: "Got your profile",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching profile",
    });
  }
};

exports.getUserInfoAndAdvices = async (req, res) => {
  try {
    // console.log("req.params.id : ", req.params.id);
    const userInfoAndAdvices = await User.findById(
      req.params.id.toString()
    ).populate({
      path: "advices",
      populate: { path: "userId", select: "username" },
    });

    // console.log("req.params.id again : ", req.params.id);

    if (userInfoAndAdvices === null) {
      return res.status(404).json({
        success: false,
        message: "No user found with given ID",
      });
    }

    res.status(200).json({
      success: true,
      userInfoAndAdvices,
      message: "User found successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTop10Users = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(10);
    // // console.log(users);
    if (!users) {
      res.status(200).json({
        success: false,
        message: "Some error occured while retrieving the users",
      });
    }
    res.status(200).json({
      success: true,
      users,
      message: "Successfully retrieved the top 10 users.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });

    if (!users) {
      res.status(200).json({
        success: false,
        message: "Some error occured while retrieving the users",
      });
    }

    // // console.log(users);

    res.status(200).json({
      success: true,
      users,
      message: "Successfully retrieved the top 10 users.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.recommend = async (req, res) => {
  try {
    // // console.log("now requested for : ", req.params.prefix);
    if (trie === null) trie = await initializeTrie();
    // // console.log(convertToLowerCase("prefix : ", req.params.prefix));
    const recommendations = trie.recommend(
      convertToLowerCase(req.params.prefix)
    );

    return res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
