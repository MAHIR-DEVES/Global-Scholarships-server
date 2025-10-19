import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    // University info
    universityName: { type: String, required: true },
    country: { type: String, required: true },
    universityLogo: { type: String },
    description: { type: String, required: true },
    website: { type: String },
    contactEmail: { type: String },
    majors: [{ type: String }],
    videoUrl: { type: String },
    worldRanking: { type: String },

    // Program info directly in main object
    level: {
      type: String,
      enum: ['Diploma', 'Bachelor', 'Master', 'PhD'],
      required: true,
    },
    duration: { type: String, required: true },
    tuitionFee: { type: String, required: true },
    applicationDeadline: { type: String, required: true },
    applicationStartDate: { type: String, required: true },
    languageRequirement: { type: String },
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
export default Scholarship;
