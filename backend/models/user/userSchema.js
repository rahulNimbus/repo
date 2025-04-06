const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  password: { type: String },
  avatar: String,
  bio: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
