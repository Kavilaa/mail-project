import asyncHandler from "express-async-handler";
import Email from "../models/Email.js";

const createEmail = asyncHandler(async (req, res) => {
  const { recipients, subject, body } = req.body;

  if (!recipients || !subject || !body) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const email = await Email.create({
    sender: req.user.email,
    recipients,
    subject,
    body,
  });

  res.status(201).json(email);
});

const getInboxEmails = asyncHandler(async (req, res) => {
  const receivedEmails = await Email.find({
    recipients: req.user.email,
    archived: false,
  }).sort({ sentAt: -1 });

  res.json(receivedEmails);
});

const getSentEmails = asyncHandler(async (req, res) => {
  const sentEmails = await Email.find({
    sender: req.user.email,
    archived: false,
  }).sort({ sentAt: -1 });

  res.json(sentEmails);
});

const getArchivedEmails = asyncHandler(async (req, res) => {
  const archivedEmails = await Email.find({
    $or: [{ recipients: req.user.email }, { sender: req.user.email }],
    archived: true,
  }).sort({ sentAt: -1 });

  res.json(archivedEmails);
});

const updateEmailArchiveStatus = asyncHandler(async (req, res) => {
  const { archived } = req.body;

  if (archived === undefined) {
    res
      .status(400)
      .json({ message: "Missing 'archived' field in request body" });
    return;
  }

  const email = await Email.findByIdAndUpdate(
    req.params.emailId,
    { archived },
    { new: true }
  );

  if (!email) {
    res.status(404).json({ message: "Email not found" });
    return;
  }

  res.json(email);
});

const getEmailById = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.emailId);

  if (!email) {
    res.status(404).json({ message: "Email not found" });
    return;
  }

  res.json(email);
});

export default {
  createEmail,
  getInboxEmails,
  getSentEmails,
  getArchivedEmails,
  updateEmailArchiveStatus,
  getEmailById,
};
