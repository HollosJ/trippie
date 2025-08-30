import express from 'express';
import { updateActivity } from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// PATCH /api/activities/:activityId
router.patch('/:activityId', authMiddleware, updateActivity);

export default router;
