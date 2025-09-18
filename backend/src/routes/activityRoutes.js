import express from 'express';
import {
  createActivity,
  deleteActivity,
  fetchActivities,
  updateActivity,
} from '../controllers/activityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/trips/:tripId/activities
router.get('/trips/:tripId/activities', authMiddleware, fetchActivities);

// POST /api/activities
router.post('/activities', authMiddleware, createActivity);

// PATCH /api/activities/:activityId
router.patch('/activities/:activityId', authMiddleware, updateActivity);

// DELETE /api/activities/:activityId
router.delete('/activities/:activityId', authMiddleware, deleteActivity);

export default router;
