const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  media: [String],
  title: String,
  description: { type: String },
  amount: { type: Number },
  user: { name: String, email: String, phone: String },
  createdAt: { type: Date, default: Date.now },
  customer: { type: String },
  status: { type: Number, default: 0 },
});
const User = mongoose.model("Payments", paymentSchema);
module.exports = User;
