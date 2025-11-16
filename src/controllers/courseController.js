import Course from "../models/course.js";
import slugify from "slugify";

// Reusable error handler
const handleError = (res, error) => {
  console.error(error);
  res
    .status(500)
    .json({ success: false, message: "Server Error", error: error.message });
};

// ===========================================
// COURSE CONTROLLERS
// ===========================================

// @desc    Create a new course
// @route   POST /api/v1/courses
export const createCourse = async (req, res) => {
  try {
    // Automatically create a slug from the title
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });

    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Get all courses (without sections/lectures for a lightweight response)
// @route   GET /api/v1/courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select("-sections")
      .populate("instructor", "name email");
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Get a single course by ID (with all details)
// @route   GET /api/v1/courses/:courseId
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "instructor",
      "name email"
    );
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Update a course's main details
// @route   PUT /api/v1/courses/:courseId
export const updateCourse = async (req, res) => {
  try {
    // If title is being updated, also update the slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:courseId
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// ===========================================
// SECTION CONTROLLERS
// ===========================================

// @desc    Add a section to a course
// @route   POST /api/v1/courses/:courseId/sections
export const addSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const newSection = { title: req.body.title, lectures: [] };
    course.sections.push(newSection);
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Update a section within a course
// @route   PUT /api/v1/courses/:courseId/sections/:sectionId
export const updateSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Mongoose sub-document .id() helper is perfect for this
    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    section.title = req.body.title;
    await course.save();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Delete a section from a course
// @route   DELETE /api/v1/courses/:courseId/sections/:sectionId
export const deleteSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Use the .pull() method to remove the section from the array
    course.sections.pull({ _id: req.params.sectionId });
    await course.save();

    res
      .status(200)
      .json({ success: true, message: "Section deleted", data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// ===========================================
// LECTURE CONTROLLERS
// ===========================================

// @desc    Add a lecture to a section
// @route   POST /api/v1/courses/:courseId/sections/:sectionId/lectures
export const addLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    section.lectures.push(req.body);
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Update a lecture in a section
// @route   PUT /api/v1/courses/:courseId/sections/:sectionId/lectures/:lectureId
export const updateLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const section = course.sections.id(req.params.sectionId);
    if (!section)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    const lecture = section.lectures.id(req.params.lectureId);
    if (!lecture)
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });

    // Update the lecture fields
    Object.assign(lecture, req.body);
    await course.save();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Delete a lecture from a section
// @route   DELETE /api/v1/courses/:courseId/sections/:sectionId/lectures/:lectureId
export const deleteLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const section = course.sections.id(req.params.sectionId);
    if (!section)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    // Use .pull() to remove the lecture
    section.lectures.pull({ _id: req.params.lectureId });
    await course.save();

    res
      .status(200)
      .json({ success: true, message: "Lecture deleted", data: course });
  } catch (error) {
    handleError(res, error);
  }
};
