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
router.get('/', authMiddleware, fetchTrips);

// POST /api/trips/
router.post('/', authMiddleware, createTrip);

// GET /api/trips/:tripId
router.get('/:tripId', authMiddleware, fetchTrip);

// DELETE /api/trips/:tripId
router.delete('/:tripId', authMiddleware, deleteTrip);

export default router;
