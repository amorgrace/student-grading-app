import { Router } from "express";
import { protect, roleGuard } from "../../middlewares/auth.middlewares.js";
import {
  enroll,
  getProfile,
  getAssignments,
  getAssignment,
  submit,
  getSubmissions,
  updateProfile
} from "./student.controllers.js";

const router = Router();

router.use(protect, roleGuard("student"));

router.get("/profile", getProfile);
router.post("/enroll", enroll);
router.get("/assignments", getAssignments);
router.get("/assignments/:id", getAssignment);
router.post("/assignments/:id/submit", submit);
router.get("/submissions", getSubmissions);
router.put("/profile", updateProfile);

export default router;