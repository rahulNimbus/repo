const express = require("express");
const {
  register,
  login,
  getData,
  update,
} = require("../Controllers/authController");
const { verifyToken } = require("../middlewares/handleToken");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getData/:id", getData);
router.put("/update", verifyToken, update);

module.exports = router; 
