import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/courseController.js";

const router = express.Router();

// == Course Routes ==
router.route("/").get(getAllCourses).post(createCourse);

router
  .route("/:courseId")
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

// == Section Routes ==
// Note: Sections are nested under a specific course
router.route("/:courseId/sections").post(addSection);

router
  .route("/:courseId/sections/:sectionId")
  .put(updateSection)
  .delete(deleteSection);

// == Lecture Routes ==
// Note: Lectures are nested under a specific section of a specific course
router.route("/:courseId/sections/:sectionId/lectures").post(addLecture);

router
  .route("/:courseId/sections/:sectionId/lectures/:lectureId")
  .put(updateLecture)
  .delete(deleteLecture);

export default router;
