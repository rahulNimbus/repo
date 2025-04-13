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
  headers: {
    balance: { type: Number, default: 0 },
    withdrawal: [
      {
        amount: { type: Number, default: 0 },
        status: {
          type: String,
          default: "pending",
          enum: ["pending", "success", "failure"],
        },
        created: { type: Number, default: () => Date.now() },
        updated: { type: Number, default: () => Date.now() },
        description: { type: String, default: "" },
      },
    ],
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
