import { Router } from "express";
import { protect, roleGuard } from "../../middlewares/auth.middlewares.js";
import {
  getProfile,
  updateProfile,
  createAssignmentController,
  getAssignmentsController,
  updateAssignmentController,
  deleteAssignmentController,
  getSubmissionsController,
  getSingleAssignmentController,
  gradeSubmissionController,
} from "./teacher.controllers.js";

const router = Router();

router.use(protect, roleGuard("teacher"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/assignments", createAssignmentController);
router.get("/assignments", getAssignmentsController);
router.get("/assignments/:id", getSingleAssignmentController);
router.put("/assignments/:id", updateAssignmentController);
router.delete("/assignments/:id", deleteAssignmentController);
router.get("/assignments/:id/submissions", getSubmissionsController);
router.put("/submissions/:id/grade", gradeSubmissionController);


export default router;