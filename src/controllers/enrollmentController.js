import Enrollment from "../models/Enrollment.js";
import Course from "../models/course.js";
import User from "../models/userModel.js";

// Reusable error handler
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ success: false, message: "Server Error", error: error.message });
};

// @desc    Enroll in a course
// @route   POST /api/enrollments
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    const userId = req.user.id; // Assumes auth middleware adds user to req

    // Check if course exists
    let course = await Course.findOne({ slug: courseId });
    if (!course) {
        try {
            course = await Course.findById(courseId);
        } catch (err) {
            // invalid id
        }
    }

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Use the actual course._id for enrollment
    const actualCourseId = course._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: actualCourseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    // Create enrollment with pending status
    const enrollment = await Enrollment.create({
      user: userId,
      course: actualCourseId,
      status: "pending", // Explicitly setting it, though default is pending
    });

    res.status(201).json({ success: true, data: enrollment, message: "Enrollment requested. Waiting for admin approval." });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/enrollments
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title price");

    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Approve/Reject enrollment
// @route   PUT /api/enrollments/:id
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Check enrollment status for a specific course
// @route   GET /api/enrollments/check/:courseId
export const checkEnrollmentStatus = async (req, res) => {
  try {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authorized" });
    }
    const userId = req.user.id;
    const { courseId } = req.params;

    // Find course first to get _id
    let course = await Course.findOne({ slug: courseId });
    if (!course) {
        try {
            course = await Course.findById(courseId);
        } catch (err) {
            // invalid id
        }
    }

    if (!course) {
        return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({ user: userId, course: course._id });

    if (!enrollment) {
      return res.status(200).json({ success: true, status: "not_enrolled" });
    }

    res.status(200).json({ success: true, status: enrollment.status, enrollment });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my-enrollments
export const getMyEnrollments = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authorized" });
      }
      const userId = req.user.id;
      const enrollments = await Enrollment.find({ user: userId }).populate("course", "title thumbnailUrl slug");

      res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    } catch (error) {
      handleError(res, error);
    }
  };
