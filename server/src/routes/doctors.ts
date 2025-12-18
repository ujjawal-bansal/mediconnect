import { Router } from "express";
import { Doctor } from "../models/Doctor";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const doctors = await Doctor.find().select(
      "name specialization experienceYears phone languages modeAvailability availability rating profileImageUrl",
    );
    res.json(doctors);
  } catch (err) {
    next(err);
  }
});

export default router;

