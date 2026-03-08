import { Router } from "express";
import { register, login } from "./auth.controllers.js";

const router = Router();

router.post("/register", register);
router.post("/loginer", login);

export default router;