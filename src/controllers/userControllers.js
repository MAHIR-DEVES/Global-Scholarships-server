import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// @desc   Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a new user
export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    country,
    educationLevel,
    fieldOfStudy,
    profileImage,
    bio,
    isVerified,
  } = req.body;

  try {
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      country,
      educationLevel,
      fieldOfStudy,
      profileImage,
      bio,
      isVerified,
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get user profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user is assigned by the protect middleware
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
