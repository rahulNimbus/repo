const express = require("express");
const { verifyToken } = require("../middlewares/handleToken");
const {
  createPayment,
  getPayment,
  updatePayment,
} = require("../Controllers/Payment/PaymentController");
const router = express.Router();

router.post("/create", verifyToken, createPayment);
router.get("/get/:id?", verifyToken, getPayment);
router.put("/update/:id?", verifyToken, updatePayment);

module.exports = router;
