import express from "express";
import {
  enrollCourse,
  getEnrollments,
  updateEnrollmentStatus,
  checkEnrollmentStatus,
  getMyEnrollments,
} from "../controllers/enrollmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All routes require login

router.route("/")
  .post(enrollCourse)
  .get(authorize("admin"), getEnrollments);

router.route("/my-enrollments").get(getMyEnrollments);

router.route("/:id")
  .put(authorize("admin"), updateEnrollmentStatus);

router.route("/check/:courseId")
  .get(checkEnrollmentStatus);

export default router;
