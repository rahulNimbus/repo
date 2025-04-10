const jwt = require("jsonwebtoken");
const User = require("../models/user/userSchema");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const genToken = (user) => {
  try {
    return jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    console.error(err);
    return null;
  }
};
const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded.user;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  genToken,
  verifyToken,
};
