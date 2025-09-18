import express from 'express';
import {
  createTrip,
  deleteTrip,
  fetchTrip,
  fetchTrips,
} from '../controllers/tripController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

// GET /api/trips/
router.get('/trips', authMiddleware, fetchTrips);

// POST /api/trips/
router.post('/trips', authMiddleware, createTrip);

// GET /api/trips/:tripId
router.get('/trips/:tripId', authMiddleware, fetchTrip);

// DELETE /api/trips/:tripId
router.delete('/trips/:tripId', authMiddleware, deleteTrip);

export default router;
