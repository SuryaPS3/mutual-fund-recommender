import express from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validation.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').notEmpty().trim()
  ],
  validate,
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  validate,
  login
);

// Get current user
router.get('/me', authMiddleware, getCurrentUser);

export default router;