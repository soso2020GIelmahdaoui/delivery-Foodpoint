import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from '../middlewares/verifyToken.js'
const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);
export default router;