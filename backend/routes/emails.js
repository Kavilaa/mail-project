import express from "express";
import Email from "../models/Email.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const { recipients, subject, body } = req.body;

    if (!recipients || !subject || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const email = await Email.create({
      sender: req.user.email,
      recipients,
      subject,
      body,
    });

    res.status(201).json(email);
  } catch (error) {
    next(error);
  }
});

router.get("/c/:emailCategory", auth, async (req, res, next) => {
  try {
    const emailCategory = req.params.emailCategory.toLowerCase();
    let emails;

    if (emailCategory === "inbox") {
      emails = await Email.find({ archived: false }).sort({ sentAt: -1 });
    } else {
      emails = await Email.find({
        archived: true,
        category: emailCategory,
      }).sort({ sentAt: -1 });
    }

    res.json(emails);
  } catch (error) {
    next(error);
  }
});

router.get("/:emailId", auth, async (req, res, next) => {
  try {
    const email = await Email.findById(req.params.emailId);

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json(email);
  } catch (error) {
    next(error);
  }
});

router.patch("/:emailId", auth, async (req, res, next) => {
  try {
    const { archived } = req.body;

    if (archived === undefined) {
      return res
        .status(400)
        .json({ message: "Missing 'archived' field in request body" });
    }

    const email = await Email.findByIdAndUpdate(
      req.params.emailId,
      { archived },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json(email);
  } catch (error) {
    next(error);
  }
});

export default router;
