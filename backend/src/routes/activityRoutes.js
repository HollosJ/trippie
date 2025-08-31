import express from 'express';
import {
  deleteActivity,
  updateActivity,
} from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// PATCH /api/activities/:activityId
router.patch('/:activityId', authMiddleware, updateActivity);

// DELETE /api/activities/:activityId
router.delete('/:activityId', authMiddleware, deleteActivity);

export default router;
