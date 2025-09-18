import express from 'express';
import {
  getMe,
  loginUser,
  registerUser,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/auth/register', registerUser);

// POST /api/auth/login
router.post('/auth/login', loginUser);

// GET /api/auth/me
router.get('/auth/me', authMiddleware, getMe);

export default router;
