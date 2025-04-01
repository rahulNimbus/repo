const express = require("express");
const { verifyToken } = require("../middlewares/handleToken");
const {
  createPayment,
  getPayment,
} = require("../Controllers/Payment/PaymentController");
const router = express.Router();

router.post("/create", verifyToken, createPayment);
router.get("/get/:id?", verifyToken, getPayment);

module.exports = router;
