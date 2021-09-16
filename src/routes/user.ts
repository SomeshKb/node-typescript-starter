
import express from "express";
import { login, signup, logout } from "../controllers/user";
const router = express.Router();

router.post("/login", login);
router.post("/register", signup);
router.post("/logout", logout);

export { router as userRouter };