import express from "express";
import auth from "../middleware/auth.js";
import emailController from "../controllers/emailControllers.js";

const router = express.Router();

router.post("/", auth, emailController.createEmail);
router.get("/inbox", auth, emailController.getInboxEmails);
router.get("/sent", auth, emailController.getSentEmails);
router.get("/archived", auth, emailController.getArchivedEmails);
router.patch("/:emailId", auth, emailController.updateEmailArchiveStatus);
router.get("/:emailId", auth, emailController.getEmailById);

export default router;
