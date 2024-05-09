import asyncHandler from "express-async-handler";
import Email from "../models/Email.js";

const composeEmail = asyncHandler(async (req, res) => {
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

const deleteEmail = asyncHandler(async (req, res) => {
  const { emailId } = req.params;

  const email = await Email.findByIdAndDelete(emailId);

  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }

  res.status(200).json({ message: "Email deleted successfully" });
});

const deleteAllInboxEmails = asyncHandler(async (req, res) => {
  try {
    const userEmail = req.user.email;

    const result = await Email.deleteMany({
      recipients: userEmail,
      sender: { $ne: userEmail },
      archived: false,
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting all inbox emails:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteAllSentEmails = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;

  const result = await Email.deleteMany({
    sender: userEmail,
    archived: false,
  });

  if (result.deletedCount > 0) {
    res.status(200).json({ message: "All sent emails deleted successfully." });
  } else {
    res.status(404).json({ message: "No sent emails found to delete." });
  }
});

const deleteAllArchivedEmails = asyncHandler(async (req, res) => {
  try {
    const userEmail = req.user.email;

    const result = await Email.deleteMany({
      recipients: userEmail,
      archived: true,
    });

    if (result.deletedCount > 0) {
      return res
        .status(200)
        .json({ message: "All archived emails deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "No archived emails found for the user" });
    }
  } catch (err) {
    console.error("Error deleting all archived emails:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default {
  composeEmail,
  getInboxEmails,
  getSentEmails,
  getArchivedEmails,
  updateEmailArchiveStatus,
  getEmailById,
  deleteEmail,
  deleteAllInboxEmails,
  deleteAllSentEmails,
  deleteAllArchivedEmails,
};
