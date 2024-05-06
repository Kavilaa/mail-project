import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import registerSchema from "../schemas/registerSchema.js";
import verifySchema from "../middleware/verifySchema.js";

const router = express.Router();

router.post(
  "/register",
  verifySchema(registerSchema),
  userController.registerUser
);

router.post("/login", userController.loginUser);
router.delete("/logout", authMiddleware, userController.logoutUser);
router.get("/status", authMiddleware, userController.getStatus);

export default router;
