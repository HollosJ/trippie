import express from "express";
import authRoutes from "./authRoutes.js";
import tripRoutes from "./tripRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/trips", tripRoutes);

export default router;
