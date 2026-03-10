import { Router } from "express";
import { register, login, logout } from "./auth.controllers.js";
import { protect } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

export default router;