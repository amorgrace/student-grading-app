import { Router } from "express";
import { protect } from "../../middlewares/auth.middlewares.js";
import {
  getSubmissionController,
  updateSubmissionController,
  deleteSubmissionController,
} from "./submission.controller.js";

const router = Router();

router.use(protect);

router.get("/:id", getSubmissionController);
router.put("/:id", updateSubmissionController);
router.delete("/:id", deleteSubmissionController);

export default router;