import mongoose from 'mongoose';

const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto added
  }
);

const Tutorial = mongoose.model('Tutorial', tutorialSchema);
export default Tutorial;
