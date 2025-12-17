import mongoose from "mongoose";
const { Schema } = mongoose;

const EnrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // We will store an array of completed lecture IDs
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    // Ensure a user can only enroll in a course once
    unique: ["user", "course"],
  }
);

export default mongoose.model("Enrollment", EnrollmentSchema);
