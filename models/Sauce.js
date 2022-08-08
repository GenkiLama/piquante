const mongoose = require("mongoose");
const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "please provide name"],
  },
  manufacturer: {
    type: String,
    required: [true, "please provide manufacturer"],
  },
  description: {
    type: String,
    required: [true, "please provide description"],
  },
  mainPepper: {
    type: String,
    required: [true, "please provide mainPepper"],
  },
  imageUrl: {
    type: String,
    required: [true, "please provide image"],
  },
  heat: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "please provide heat"],
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
  usersLiked: {
    type: [String],
  },
  usersDisliked: {
    type: [String],
  },
});

module.exports = mongoose.model("Sauce", sauceSchema);
