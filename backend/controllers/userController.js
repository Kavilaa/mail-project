import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  req.session.userId = user._id;

  res.json({ email: user.email, _id: user._id });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  req.session.userId = user._id;

  res.json({ email: user.email, _id: user._id });
});

const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy();

  res.sendStatus(200);
});

const getStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ email: user.email, _id: user._id });
});

export default {
  registerUser,
  loginUser,
  logoutUser,
  getStatus,
};
