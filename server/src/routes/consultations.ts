import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Consultation } from "../models/Consultation";

const router = Router();

router.use(authMiddleware);

router.post("/", async (req, res, next) => {
  try {
    const { doctorId, mode, symptoms, patientName, patientPhone } = req.body as {
      doctorId?: string;
      mode?: "chat" | "audio" | "video";
      symptoms?: string;
      patientName?: string;
      patientPhone?: string;
    };

    if (!doctorId || !mode || !symptoms) {
      return res
        .status(400)
        .json({ message: "doctorId, mode, and symptoms are required" });
    }

    const consultation = await Consultation.create({
      patient: req.user!.userId,
      doctor: doctorId,
      mode,
      symptoms,
      patientName,
      patientPhone,
      messages: [],
    });

    // Emit new consultation request to doctor
    const { io } = await import("../server");
    io.emit("consultation:new-request", {
      consultationId: consultation._id.toString(),
      doctorId,
    });

    res.status(201).json(consultation);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const consultations = await Consultation.find({
      patient: req.user!.userId,
    })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      patient: req.user!.userId,
    }).populate("doctor", "name specialization");

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/end", async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      patient: req.user!.userId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    consultation.status = "ended";
    consultation.endedAt = new Date();
    await consultation.save();

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

export default router;

