import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Doctor } from "../models/Doctor";
import { env } from "../config/env";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, doctor.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { doctorId: doctor._id.toString(), role: "doctor" },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Update availability to online on login
    doctor.availability = "online";
    await doctor.save();

    res.json({
      token,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experienceYears: doctor.experienceYears,
        phone: doctor.phone,
        hospital: doctor.hospital,
        clinic: doctor.clinic,
        availability: doctor.availability,
        modeAvailability: doctor.modeAvailability,
        rating: doctor.rating,
        profileImageUrl: doctor.profileImageUrl,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;

