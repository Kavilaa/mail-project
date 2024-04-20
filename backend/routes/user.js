import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    req.session.userId = user._id;
    res.json({ email: user.email, _id: user._id });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", auth, async (req, res, next) => {
  try {
    req.session.destroy();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.get("/status", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ email: user.email, _id: user._id });
  } catch (error) {
    next(error);
  }
});

router.get("/home", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      _id: user._id,
      message: "Welcome to the home page!",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
