const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { isEmail, isStrongPassword } = require("validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "please provide email"],
    unique: true,
    validate: [isEmail],
  },
  password: {
    type: String,
    required: [true, "please provide email"],
    minlength: 8,
    validate: [isStrongPassword],
  },
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
