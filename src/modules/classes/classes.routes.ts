import { Router } from "express";
import { getClasses, enrollStudentController, getClassById} from "./classes.controllers.js";
import { protect, roleGuard } from "../../middlewares/auth.middlewares.js";

const router = Router();

router.get("/", getClasses);
router.get("/:id", protect, getClassById);
router.post("/enroll", protect, roleGuard("student"), enrollStudentController);

export default router;