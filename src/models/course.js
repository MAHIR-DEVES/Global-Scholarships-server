const mongoose = require("mongoose");
const { Schema } = mongoose;

//==================================================
// LECTURE SCHEMA (The smallest, most nested part)
//==================================================
// This will be a sub-document. It doesn't need its own model.
const LectureSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "Lecture video URL is required"],
    },
    duration: {
      type: Number, // Duration in seconds
      required: [true, "Lecture duration is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    isPreviewable: {
      // Can non-enrolled users watch this lecture?
      type: Boolean,
      default: false,
    },
    // You could add more here, like downloadable resources
    // resources: [{ name: String, url: String }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for each lecture
  }
);

//==================================================
// SECTION SCHEMA (Contains an array of Lectures)
//==================================================
// This will also be a sub-document.
const SectionSchema = new Schema({
  title: {
    type: String,
    required: [true, "Section title is required"],
    trim: true,
  },
  // We embed the LectureSchema directly here
  lectures: [LectureSchema],
});

//==================================================
// COURSE SCHEMA (The main, top-level model)
//==================================================
const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      unique: true,
    },
    slug: {
      // For SEO-friendly URLs like /courses/learn-react-js
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    instructor: {
      // This is a REFERENCE to a User document.
      // We are not embedding the whole user object.
      type: Schema.Types.ObjectId,
      ref: "User", // Assumes you have a 'User' model
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
    },
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    isPublished: {
      // To handle drafts and published courses
      type: Boolean,
      default: false,
    },
    // We embed the SectionSchema directly here
    sections: [SectionSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for the whole course
  }
);

// Create the model from the schema and export it
const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
