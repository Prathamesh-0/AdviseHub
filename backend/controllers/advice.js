const Advice = require("../models/Advice");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { useResolvedPath } = require("react-router-dom");
const { deleteCommentAndChildren } = require("../utils/helperFunctions");
const Tag = require("../models/Tag");

const commentPoints = 2;
const advicePoints = 5;

exports.advise = async (req, res) => {
  try {
    const tmp = await Tag.find().limit(1);
    if (tmp.length === 0) {
      await Tag.create({
        tagName: "Life",
      });
      await Tag.create({
        tagName: "Love",
      });
      await Tag.create({
        tagName: "Career",
      });
      await Tag.create({
        tagName: "Development",
      });
      await Tag.create({
        tagName: "DSA",
      });
      await Tag.create({
        tagName: "CP",
      });
      await Tag.create({
        tagName: "Placements",
      });
      await Tag.create({
        tagName: "Culturals",
      });
      await Tag.create({
        tagName: "Sports",
      });
    }

    const user = req.user;
    const content = req.body.content;

    const tagIds = req.body.tags;
    const tags = [];
    const catRefs = [];

    // console.log("first");

    for (let i = 0; i < tagIds.length; i++) {
      const catEntry = await Tag.findById(tagIds[i]);
      if (catEntry !== null) {
        tags.push(catEntry);
        catRefs.push(catEntry._id);
      }
    }

    const newAdvice = {
      content,
      userId: req.user._id,
      tags: catRefs,
    };

    // console.log("mid: newAdvice : ", newAdvice);

    const advice = await Advice.create(newAdvice);
    // instead of sorting by time while retrieving advices of an user,
    // we simply always just insert the new advice in the beginning
    // of our array.

    // console.log("mid1");
    user.advices.unshift(advice._id);
    // // console.log("mid2");
    await user.save();

    // // console.log("advice : ", advice);

    for (let i = 0; i < tags.length; i++) {
      tags[i].advices.push(advice._id);
      await tags[i].save();
    }

    // console.log("successsfully given advice");

    return res.status(201).json({
      success: true,
      advice,
      message: "Advice given successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.handleVotes = async (req, res) => {
  // console.log("laude ka API", req.user);
  try {
    const { isUpvoted, isDownvoted } = req.body;

    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    if (isUpvoted) {
      // You want to upvote

      // not yet upvoted
      if (!advice.upvotes.includes(req.user._id)) {
        if (advice.downvotes.includes(req.user._id)) {
          const index = advice.downvotes.indexOf(req.user._id);
          advice.score++;
          advice.downvotes.splice(index, 1);
        }

        advice.upvotes.push(req.user._id);
        // // console.log(advice.upvotes);
        advice.score++;
        await advice.save();

        const user = await User.findById(advice.userId);
        user.points += advicePoints;
        await user.save();
        // console.log("advice upvoted successfully", advice);
      }
    } else {
      // You want to un-upvote
      if (advice.upvotes.includes(req.user._id)) {
        const index = advice.upvotes.indexOf(req.user._id);

        advice.upvotes.splice(index, 1);
        advice.score--;
        await advice.save();

        const user = await User.findById(advice.userId);
        user.points -= advicePoints;
        await user.save();

        // console.log("advice un-upvoted successfully", advice);
      }
    }

    if (isDownvoted) {
      // You want to downvote

      // not yet downvoted
      if (!advice.downvotes.includes(req.user._id)) {
        if (advice.upvotes.includes(req.user._id)) {
          const index = advice.upvotes.indexOf(req.user._id);
          advice.score--;
          advice.upvotes.splice(index, 1);
        }

        advice.downvotes.push(req.user._id);
        advice.score--;
        await advice.save();

        const user = await User.findById(advice.userId);
        user.points -= advicePoints;
        await user.save();

        // console.log("advice downvoted successfully", advice);
      }
    } else {
      // you want to un-downvote
      if (advice.downvotes.includes(req.user._id)) {
        const index = advice.downvotes.indexOf(req.user._id);

        advice.downvotes.splice(index, 1);
        advice.score++;
        await advice.save();

        const user = await User.findById(advice.userId);
        user.points += advicePoints;
        await user.save();

        // console.log("advice un-downvoted successfully", advice);
      }
    }

    return res.status(200).json({
      success: true,
      advice,
      message: "SUCCESSSS",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.upvoteAdvice = async (req, res) => {
  try {
    // console.log("request to upvote");
    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    if (advice.upvotes.includes(req.user._id)) {
      const index = advice.upvotes.indexOf(req.user._id);

      advice.upvotes.splice(index, 1);
      advice.score--;
      await advice.save();

      const user = await User.findById(advice.userId);
      user.points -= advicePoints;
      await user.save();

      // console.log("advice un-upvoted successfully", advice);

      return res.status(200).json({
        success: true,
        message: "un-upvoted successfully",
      });
    } else {
      if (advice.downvotes.includes(req.user._id)) {
        const index = advice.downvotes.indexOf(req.user._id);
        advice.score++;
        advice.downvotes.splice(index, 1);
      }

      advice.upvotes.push(req.user._id);
      // // console.log(advice.upvotes);
      advice.score++;
      await advice.save();

      const user = await User.findById(advice.userId);
      user.points += advicePoints;
      await user.save();

      // console.log("advice downvoted successfully", advice);

      return res.status(200).json({
        success: true,
        message: "upvoted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downvoteAdvice = async (req, res) => {
  try {
    // console.log("request to downvote");
    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    if (advice.downvotes.includes(req.user._id)) {
      const index = advice.downvotes.indexOf(req.user._id);

      advice.downvotes.splice(index, 1);
      advice.score++;
      await advice.save();

      const user = await User.findById(advice.userId);
      user.points += advicePoints;
      await user.save();

      // console.log("advice un-downvoted successfully", advice);

      return res.status(200).json({
        success: true,
        message: "un-downvoted successfully",
      });
    } else {
      if (advice.upvotes.includes(req.user._id)) {
        const index = advice.upvotes.indexOf(req.user._id);
        advice.score--;
        advice.upvotes.splice(index, 1);
      }

      advice.downvotes.push(req.user._id);
      advice.score--;
      await advice.save();

      const user = await User.findById(advice.userId);
      user.points -= advicePoints;
      await user.save();

      // console.log("advice downvoted successfully", advice);
      return res.status(200).json({
        success: true,
        message: "downvoted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.commentOnAdvice = async (req, res) => {
  try {
    // console.log("advice pe comment start : ");
    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      return res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    const newComment = {
      userId: req.user._id,
      adviceId: advice._id,
      content: req.body.content,
    };
    const comment = await Comment.create(newComment);
    advice.comments.push(comment._id);
    await advice.save();

    // console.log("advice pe comment end : ", comment);
    return res.status(201).json({
      success: true,
      comment,
      message: "Successfully commented",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Made by me.
exports.replyToComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id.toString());
    // console.log("newComment reply start : ");
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "No such comment found",
      });
    }
    const commentAsReply = {
      userId: req.user._id,
      content: req.body.content,
      parentComment: comment._id,
    };
    const newComment = await Comment.create(commentAsReply);
    comment.replies.push(newComment._id);

    await comment.save();

    // console.log("newComment : ", newComment);

    return res.status(201).json({
      success: true,
      comment: newComment,
      message: "Successfully replied",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "No such comment found",
      });
    }

    if (comment.upvotes.includes(req.user._id)) {
      const index = comment.upvotes.indexOf(req.user._id);

      comment.upvotes.splice(index, 1);
      comment.score--;
      await comment.save();

      const user = await User.findById(comment.userId);
      user.points -= commentPoints;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "un-upvoted successfully",
      });
    } else {
      if (comment.downvotes.includes(req.user._id)) {
        // Added newly
        const index = comment.downvotes.indexOf(req.user._id);
        comment.score++;
        comment.downvotes.splice(index, 1);
      }

      comment.upvotes.push(req.user._id);
      comment.score++;
      await comment.save();

      const user = await User.findById(comment.userId);
      user.points += commentPoints;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "upvoted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "No such comment found",
      });
    }

    if (comment.downvotes.includes(req.user._id)) {
      const index = comment.downvotes.indexOf(req.user._id);

      comment.downvotes.splice(index, 1);
      comment.score++;
      await comment.save();

      const user = await User.findById(comment.userId);
      user.points += commentPoints;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "un-downvoted successfully",
      });
    } else {
      if (comment.upvotes.includes(req.user._id)) {
        const index = comment.upvotes.indexOf(req.user._id);
        comment.score--;
        comment.upvotes.splice(index, 1);
      }

      comment.downvotes.push(req.user._id);
      comment.score--;
      await comment.save();

      const user = await User.findById(comment.userId);
      user.points -= commentPoints;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "downvoted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAdvice = async (req, res) => {
  try {
    const deletedAdvice = await Advice.findByIdAndDelete(req.params.id);

    if (!deletedAdvice) {
      return res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    if (deletedAdvice.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Sorry, you don't have permission to delete this advice",
      });
    }

    const user = await User.findById(req.user._id);
    user.points -= deletedAdvice.score * advicePoints;
    user.advices.splice(user.advices.indexOf(req.params.id), 1);
    await user.save();

    for (let i = 0; i < deletedAdvice.comments.length; i++) {
      await deleteCommentAndChildren(deletedAdvice.comments[i]._id);
    }

    for (let i = 0; i < deletedAdvice.tags.length; i++) {
      const tag = await Tag.findById(deletedAdvice.tags[i]);

      if (tag !== null) {
        tag.advices.forEach((item, index) => {
          if (item.toString() === deletedAdvice._id.toString()) {
            return tag.advices.splice(index, 1);
          }
        });
        await tag.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Advice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured while deleting this advice",
    });
  }
};

// NEW ONES :
exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      res.status(404).json({
        success: false,
        message: "No such comment found",
      });
    }

    if (deletedComment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Sorry, you don't have permission to delete this advice",
      });
    }

    const user = await User.findById(deletedComment.userId);
    user.points -= deletedComment.score * commentPoints;
    await user.save();

    if (deletedComment.adviceId) {
      const advice = await Advice.findById(deletedComment.adviceId);

      advice.comments.forEach((item, index) => {
        if (item._id.toString() === deletedComment._id.toString()) {
          return advice.comments.splice(index, 1);
        }
      });

      await advice.save();
    } else {
      const parentComment = await Comment.findById(
        deletedComment.parentComment
      );

      parentComment.replies.forEach((item, index) => {
        if (item._id.toString() === deletedComment._id.toString()) {
          return parentComment.replies.splice(index, 1);
        }
      });

      await parentComment.save();
    }

    deleteCommentAndChildren(deletedComment._id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAdvice = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);

    if (!advice) {
      res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    if (advice.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this",
      });
    }

    advice.content = req.body.content;
    for (let i = 0; i < advice.tags.length; i++) {
      const tag = await Tag.findById(advice.tags[i]);

      for (let j = 0; j < tag.advices.length; j++) {
        if (tag.advices[j].toString() === advice._id.toString()) {
          tag.advices.splice(j, 1);
        }
      }
      await tag.save();
    }

    const tagIds = req.body.tags;
    const catRefs = [];

    for (let i = 0; i < tagIds.length; i++) {
      const catEntry = await Tag.findById(tagIds[i]);
      if (catEntry !== null) {
        catRefs.push(catEntry._id);
        catEntry.advices.push(advice._id);
        await catEntry.save();
      }
    }

    advice.tags = catRefs;
    advice.updatedAt = Date.now();
    await advice.save();

    res.status(200).json({
      success: true,
      advice,
      message: "Advice updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this",
      });
    }

    comment.content = req.body.content;
    comment.updatedAt = Date.now();
    await comment.save();

    res.status(200).json({
      success: true,
      comment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLatestAdvices = async (req, res) => {
  try {
    // // console.log(req);
    const page = parseInt(req.params.page) || 1;
    // console.log("requested latest for", page);
    const limit = 20;
    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Fetch the advices with pagination
    // const advices = await Advice.find()
    //   .skip(skip)
    //   .limit(limit)
    //   .exec();

    // res.json(advices);

    // // console.log("here");
    const latestAdvices = await Advice.find({})
      .sort({ createdAt: -1 }) // Sort by 'createdAt' field in descending order (latest first)
      .populate("userId", "username") // Populate user information and select only the 'username' field
      .populate("tags", "tagName")
      .sort({ tagName: 1 })
      .skip(skip)
      .limit(limit);
    // .limit(limit); // Number of posts you want to retrieve

    return res.status(200).json({
      success: true,
      advices: latestAdvices,
      message: "Latest posts retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTopScoredAdvices = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    // console.log("requested top for", page);
    const limit = 20;
    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    const topScoredAdvices = await Advice.find({}) // Empty query to retrieve all posts
      .sort({ score: -1 }) // Sort by 'score' field in descending order
      .populate("userId", "username") // Populate user information and select only the 'username' field
      .populate("tags", "tagName")
      // .sort({ tagName: 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      advices: topScoredAdvices,
      message: "Successfully retrieved top advices",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTopScoredCommentsToAdvice = async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id).populate({
      path: "comments",
      populate: { path: "userId", select: "username" }, // Populate user information for comments
      options: { sort: { score: -1 } }, // Sort comments in descending order of score
    });

    if (!advice) {
      res.status(404).json({
        success: false,
        message: "No such advice found",
      });
    }

    const sortedComments = advice.comments;
    // console.log("sortedComments", sortedComments);
    res.status(200).json({
      success: true,
      comments: sortedComments,
      message: "Comments retrieved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTopScoredRepliesToComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: "replies",
      populate: { path: "userId", select: "username" }, // Populate user information for comments
      options: { sort: { score: -1 } },
    });

    if (!comment) {
      res.status(404).json({
        success: false,
        message: "No such comment found",
      });
    }

    const sortedReplies = comment.replies;

    // console.log("sortedReplies", sortedReplies);
    res.status(200).json({
      success: true,
      comments: sortedReplies,
      message: "Replies retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find().select("_id tagName").sort({ tagName: 1 });

    if (!tags || tags.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No tags found",
      });
    }

    return res.status(200).json({
      success: true,
      tags,
      message: "Successfully retrieved all the tags",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTopScoredAdvicesByTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // console.log("requested latest by tags for", page);
    const limit = 10;
    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    const advices = new Set();
    const tagIdsString = req.query.tags;
    const tagIds = tagIdsString.split(",");

    // console.log("getting top advices for Tags = ", tagIds, "and page = ", page);

    for (let i = 0; i < tagIds.length; i++) {
      const tag = await Tag.findById(tagIds[i]);

      if (tag !== null) {
        for (let j = 0; j < tag.advices.length; j++) {
          advices.add(tag.advices[j].toString());
        }
      }
    }

    const advicesUniqueIdArray = [...advices];
    const advicesArray = [];
    for (let i = 0; i < advicesUniqueIdArray.length; i++) {
      const advice = await Advice.findById(advicesUniqueIdArray[i])
        .populate("userId", "username") // Populate user information and select only the 'username' field
        .populate("tags", "tagName")
        // .sort({ tagName: 1 })
        .skip(skip)
        .limit(limit);
      if (advice !== null) advicesArray.push(advice);
    }

    advicesArray.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      advices: advicesArray,
      message: "Requested advices retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLatestAdvicesByTags = async (req, res) => {
  try {
    // console.log("req.query : ", req.query);
    const page = parseInt(req.query.page) || 1;
    // console.log("requested top by tags for", page);
    const limit = 10;
    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    const advices = new Set();
    const tagIdsString = req.query.tags;
    // console.log("getLatestAdvicesByTags -> req.query.tags : ", req.query.tags);
    const tagIds = tagIdsString.split(",");

    // console.log(
    //   "getting latest advices for Tags = ",
    //   tagIds,
    //   "and page = ",
    //   page
    // );
    for (let i = 0; i < tagIds.length; i++) {
      const tag = await Tag.findById(tagIds[i]);

      if (tag !== null) {
        for (let j = 0; j < tag.advices.length; j++) {
          advices.add(tag.advices[j].toString());
        }
      }
    }

    const advicesUniqueIdArray = [...advices];
    const advicesArray = [];

    for (let i = 0; i < advicesUniqueIdArray.length; i++) {
      const advice = await Advice.findById(advicesUniqueIdArray[i])
        .populate("userId", "username") // Populate user information and select only the 'username' field
        .populate("tags", "tagName")
        // .sort({ tagName: 1 });
        .skip(skip)
        .limit(limit);

      if (advice !== null) advicesArray.push(advice);
    }

    // console.log("advicesArray : ", advicesArray);

    advicesArray.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      advices: advicesArray,
      message: "Requested advices retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
