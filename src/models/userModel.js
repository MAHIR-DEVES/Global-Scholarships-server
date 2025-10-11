import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // Profile info
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    phone: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    educationLevel: {
      type: String,
      enum: [
        '',
        'High School',
        'Diploma',
        'Bachelor',
        'Master',
        'PhD',
        'Other',
      ],
      default: '',
    },
    fieldOfStudy: {
      type: String,
      default: '',
    },

    // Extra features
    profileImage: {
      type: String, // URL
      default: '',
    },
    bio: {
      type: String,
      maxlength: 300,
    },

    // Account management
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Pre-save middleware to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it is new or modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // generate salt
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
