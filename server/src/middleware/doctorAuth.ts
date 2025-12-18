import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Doctor } from "../models/Doctor";

export interface DoctorAuthPayload {
  doctorId: string;
  role: "doctor";
}

declare module "express-serve-static-core" {
  interface Request {
    doctor?: DoctorAuthPayload;
  }
}

export const doctorAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { doctorId: string; role: string };

    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Doctor access required" });
    }

    const doctor = await Doctor.findById(decoded.doctorId);
    if (!doctor) {
      return res.status(401).json({ message: "Doctor not found" });
    }

    req.doctor = {
      doctorId: decoded.doctorId,
      role: "doctor",
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

