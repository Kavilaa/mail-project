import express from "express";
import authMiddleware from "../middleware/auth.js";
import emailController from "../controllers/emailControllers.js";

const router = express.Router();

router.post("/", authMiddleware, emailController.createEmail);
router.get("/inbox", authMiddleware, emailController.getInboxEmails);
router.get("/sent", authMiddleware, emailController.getSentEmails);
router.get("/archived", authMiddleware, emailController.getArchivedEmails);
router.patch(
  "/:emailId",
  authMiddleware,
  emailController.updateEmailArchiveStatus
);
router.get("/:emailId", authMiddleware, emailController.getEmailById);

export default router;
