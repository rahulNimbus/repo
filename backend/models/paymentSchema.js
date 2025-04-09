const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  media: [String],
  title: String,
  description: { type: String },
  amount: { type: Number },
  createdAt: { type: Date, default: Date.now },
  customer: [
    {
      name: String,
      email: String,
      phone: String,
      status: { type: Number, default: 0 },
    },
  ],
  enabled: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: "Users" },
});

const User = mongoose.model("Payments", paymentSchema);
module.exports = User;
