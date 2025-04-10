const express = require("express");
const { verifyToken } = require("../middlewares/handleToken");
const {
  createPayment,
  getPayment,
  payPayment,
} = require("../Controllers/Payment/PaymentController");
const router = express.Router();

router.post("/create", verifyToken, createPayment);
router.get("/get/:id?", verifyToken, getPayment);
router.put("/pay/:id?", verifyToken, payPayment);

module.exports = router;
