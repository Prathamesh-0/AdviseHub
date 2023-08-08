const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  tagName: {
    type: String,
    required: true,
    unique: true,
  },
  advices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advice",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Tag", tagSchema);
