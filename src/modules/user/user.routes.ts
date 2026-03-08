import { Router } from "express";
import { getMe } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.get("/me", protect, getMe);

export default router;