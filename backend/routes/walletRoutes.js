const express = require("express");
const { verifyToken } = require("../middlewares/handleToken");
const {
  getWithdrawal,
  initiateWithdrawal,
  approveWithdrawal,
} = require("../Controllers/Wallet/WalletController");
const router = express.Router();

router.get("/withdrawal/:id?", verifyToken, getWithdrawal);
router.post("/withdrawal/initiate", verifyToken, initiateWithdrawal);
router.post(
  "/withdrawal/approveWithdrawal/:id",
  verifyToken,
  approveWithdrawal
);

module.exports = router;
