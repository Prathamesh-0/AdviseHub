const Comment = require("../models/Comment");
const User = require("../models/User");
const Trie = require("./Trie");

// Function to retrieve comment and its children recursively
const getCommentAndChildren = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      console.log("No such comment found.");
      return [];
    }

    const childrenComments = [];

    for (let i = 0; i < comment.replies.length; i++) {
      const childComments = await getCommentAndChildren(comment.replies[i]._id);
      childrenComments.push(...childComments);
    }

    return [comment, ...childrenComments];
  } catch (err) {
    console.error("Error retrieving the comments", err);
    throw err;
  }
};

// Function to delete comment and its children
exports.deleteCommentAndChildren = async (commentId) => {
  try {
    const commentsToDelete = await getCommentAndChildren(commentId);

    if (commentsToDelete.length === 0) {
      console.log("No comments found.");
      return;
    }

    const deletedComments = await Comment.deleteMany({
      _id: { $in: commentsToDelete.map((comment) => comment._id) },
    });

    console.log("Deleted Comments :", deletedComments.deletedCount);
  } catch (err) {
    console.error("Error while deleting comments :", err);
    throw err;
  }
};

exports.initializeTrie = async () => {
  const trie = new Trie();
  const users = await User.find({});
  for (let i = 0; i < users.length; i++) {
    trie.insert(users[i].username, users[i]._id);
  }
  return trie;
};

exports.convertToLowerCase = (text) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char >= "A" && char <= "Z") {
      result += char.toLowerCase();
    } else {
      result += char;
    }
  }
  return result;
};
