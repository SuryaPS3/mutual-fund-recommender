import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/helpers.js';
import { ValidationError } from '../utils/errors.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('User already exists with this email');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    password_hash,
    full_name
  });

  // Generate token
  const token = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    user: {
      user_id: user._id,
      email: user.email,
      full_name: user.full_name
    },
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new ValidationError('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    user: {
      user_id: user._id,
      email: user.email,
      full_name: user.full_name
    },
    token
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.user_id).select('-password_hash');
  res.json(user);
});