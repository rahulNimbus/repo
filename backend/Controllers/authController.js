const {
  avatarMulter,
  handleMulterErrors,
} = require("../middlewares/multers/avatarMulter");
const { genToken } = require("../middlewares/handleToken");
const User = require("../models/user/userSchema");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const {
  capitalize,
  checkEmail,
  checkPassword,
} = require("../utils/CommonFunctions");

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
      //   return res.status(400).json({ error: "Please upload an avatar" });
      // }
      if (!checkEmail(email))
        return res.status(400).json({ error: "Invalid email" });

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ error: "Email already registered" });
      }

      if (!checkPassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character and no whitespace.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
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
          return res
            .status(400)
            .json({ message: `${capitalize(field)} is required` });
        }
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
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
      // const userId = req.params.id;
      // if (!userId) {
      //   return res.status(400).json({ message: "User id is required" });
      // }
      // if (!mongoose.Types.ObjectId.isValid(userId)) {
      //   return res.status(400).json({ message: "Invalid user id" });
      // }

      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ error: "User id is required" });
      }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ error: "User not found" });
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
      newUser.headers.withdrawal = newUser.headers.withdrawal?.sort(
        (a, b) => b.created - a.created
      );

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
      const userId = req.body.id;
      if (!userId) {
        return res.status(400).json({ error: "User id is required" });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
      }

      // The user should either be the admin or the user himself to update the data.

      if (
        req.user.id.toString() !== userId.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      const {
        username,
        bio,
        password,
        confirmPassword,
        oldPassword,
        email,
        role,
      } = req.body;
      if (username) {
        user.username = username;
      }

      if (bio) {
        user.bio = bio;
      }

      if (password) {
        if (!oldPassword) {
          return res
            .status(400)
            .json({ error: "Old Password is also required." });
        }
        if (!confirmPassword) {
          return res
            .status(400)
            .json({ error: "Confirm Password is also required." });
        }
        if (!bcrypt.compareSync(oldPassword, user.password)) {
          return res.status(400).json({ error: "Invalid old password" });
        }

        if (!checkPassword(password)) {
          return res.status(400).json({
            message:
              "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character and no whitespace.",
          });
        }

        if (password !== confirmPassword) {
          return res.status(400).json({ error: "Passwords do not match" });
        }

        if (confirmPassword && password === confirmPassword) {
          user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        }
      }

      if (email) {
        if (!checkEmail(email))
          return res.status(400).json({ error: "Invalid email" });

        const existingUser = await User.findOne({ email });
        if (
          existingUser &&
          existingUser._id.toString() !== user._id.toString()
        ) {
          return res.status(400).json({ error: "Email already registered" });
        }

        user.email = email;
      }

      if (req.file) {
        user.avatar = req.file.path;
      }

      if (role) {
        if (req.user.role !== "admin") {
          return res.status(401).json({ error: "Unauthorized" });
        }
        if (role !== "user" && role !== "admin") {
          return res.status(400).json({
            error: "Invalid role. Role can only be 'user' or 'admin'.",
          });
        }
        user.role = role;
      }

      await user.save();

      const token = genToken(user);

      res.cookie("token", token, cookieOptions);
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
