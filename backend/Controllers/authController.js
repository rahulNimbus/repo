const {
  avatarMulter,
  handleMulterErrors,
} = require("../middlewares/multers/avatarMulter");
const { genToken } = require("../middlewares/handleToken");
const User = require("../models/user/userSchema");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const cookieOptions = {
  expires: new Date(Date.now() + 3600000),
};

exports.register = [
  avatarMulter.single("avatar"),
  handleMulterErrors,
  async (req, res) => {
    try {
      const { username, password, confirmPassword, email } = req.body;

      const requiredFields = [
        "username",
        "password",
        "confirmPassword",
        "email",
      ];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }

      // if (!req.file) {
      //   return res.status(400).json({ message: "Please upload an avatar" });
      // }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "Email already registered" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const newUser = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        avatar: req.file?.path || null,
      });

      const token = genToken(newUser);

      res.cookie("token", token, cookieOptions);

      res.status(200).json({
        message: `Welcome to the app, ${newUser.username}!`,
        user: { id: newUser._id },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
];

exports.login = [
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = genToken(user);

      res.cookie("token", token, cookieOptions);

      res.status(200).json({
        message: `Welcome back, ${user.username}!`,
        user: { id: user._id },
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
];

exports.getData = [
  async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({ message: "User id is required" });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const newUser = JSON.parse(JSON.stringify(user));
      if (newUser.avatar) {
        newUser.avatar = new URL(
          req.protocol +
            "://" +
            req.get("host") +
            "/api/" +
            newUser.avatar.replaceAll("\\", "/")
        );
      }

      res.status(200).json({
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
];

exports.update = [
  avatarMulter.single("avatar"),
  handleMulterErrors,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const { username, bio } = req.body;
      if (username) {
        user.username = username;
      }
      if (bio) {
        user.bio = bio;
      }

      if (req.file) {
        user.avatar = req.file.path;
      }
      await user.save();
      res.status(200).json({
        message: `User updated successfully`,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
];
