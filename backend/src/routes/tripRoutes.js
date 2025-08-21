import express from "express";
import {
  createTrip,
  fetchTrip,
  fetchTrips,
} from "../controllers/tripController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, fetchTrips);
router.post("/", authMiddleware, createTrip);
router.get("/:tripId", authMiddleware, fetchTrip);

export default router;
