import express from "express";
import auth from "../middleware/auth.js";
import emailController from "../controllers/emailControllers.js";

const router = express.Router();

router.post("/c/compose", auth, emailController.composeEmail);
router.get("/c/inbox", auth, emailController.getInboxEmails);
router.get("/c/sent", auth, emailController.getSentEmails);
router.get("/c/archived", auth, emailController.getArchivedEmails);
router.patch("/:emailId", auth, emailController.updateEmailArchiveStatus);
router.get("/:emailId", auth, emailController.getEmailById);
router.delete("/:emailId", auth, emailController.deleteEmail);
router.delete("/inbox/deleteall", auth, emailController.deleteAllInboxEmails);
router.delete("/sent/deleteall", auth, emailController.deleteAllSentEmails);
router.delete(
  "/archived/deleteall",
  auth,
  emailController.deleteAllArchivedEmails
);

export default router;
