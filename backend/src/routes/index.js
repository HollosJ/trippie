import express from 'express';
import authRoutes from './authRoutes.js';
import tripRoutes from './tripRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/', tripRoutes);
router.use('/', activityRoutes);

export default router;
