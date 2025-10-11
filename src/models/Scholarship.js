import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['Diploma', 'Bachelor', 'Master', 'PhD'],
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  tuitionFee: {
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  applicationDeadline: {
    type: String,
    required: true,
  },
  languageRequirement: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  // Program-level fields
  feeStructure: {
    type: String,
  },
  scholarshipCover: {
    type: String,
  },
});

const scholarshipSchema = new mongoose.Schema(
  {
    universityName: {
      type: String,
      required: [true, 'University name is required'],
    },
    country: {
      type: String,
      enum: ['China', 'Malaysia', 'USA', 'UK', 'Canada', 'Australia'],
      required: [true, 'Country is required'],
    },
    universityLogo: {
      type: String, // Image URL
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    programs: {
      type: [programSchema],
      required: [true, 'At least one program is required'],
      validate: {
        validator: function (programs) {
          return programs.length >= 1 && programs.length <= 1; // Exactly one program
        },
        message: 'A scholarship must have exactly one program',
      },
    },
    website: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    // University-level fields
    majors: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
    },
    worldRanking: {
      type: String,
    },
  },
  { timestamps: true }
);

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

export default Scholarship;
