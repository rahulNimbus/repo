const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  image: String,
  title: String,
  despcription: { type: String },
  amount: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
});
const User = mongoose.model("Payments", paymentSchema);
module.exports = User;
