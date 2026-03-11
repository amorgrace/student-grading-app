import { Router } from "express";
import { protect } from "../../middlewares/auth.middlewares.js";
import { getAllSubjects, getSubjectById } from "./subject.controllers.js";

const router = Router();

router.get("/", protect, getAllSubjects);
router.get("/:id", protect, getSubjectById);

export default router;