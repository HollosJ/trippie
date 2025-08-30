import express from 'express';
import authRoutes from './authRoutes.js';
import tripRoutes from './tripRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/activities', activityRoutes);

export default router;
