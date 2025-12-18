import { Router } from "express";
import { doctorAuthMiddleware } from "../middleware/doctorAuth";
import { Doctor } from "../models/Doctor";
import { Consultation } from "../models/Consultation";

const router = Router();

router.use(doctorAuthMiddleware);

// Get doctor profile
router.get("/profile", async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor!.doctorId)
      .select("-passwordHash")
      .lean();

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

// Update availability
router.patch("/availability", async (req, res, next) => {
  try {
    const { availability } = req.body as { availability?: "online" | "busy" | "offline" };

    if (!availability || !["online", "busy", "offline"].includes(availability)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctor!.doctorId,
      { availability },
      { new: true },
    ).select("-passwordHash");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Emit availability change to all connected clients
    const { io } = await import("../server");
    io.emit("doctor:availability-changed", {
      doctorId: doctor._id.toString(),
      availability: doctor.availability,
    });

    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

// Get dashboard stats
router.get("/dashboard/stats", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      activeConsultations,
      todayConsultations,
      emergencyConsultations,
    ] = await Promise.all([
      Consultation.countDocuments({
        doctor: doctorId,
        status: "active",
      }),
      Consultation.countDocuments({
        doctor: doctorId,
        startedAt: { $gte: today },
      }),
      Consultation.countDocuments({
        doctor: doctorId,
        isEmergency: true,
        status: "active",
      }),
    ]);

    res.json({
      activeConsultations,
      todayConsultations,
      emergencyConsultations,
    });
  } catch (err) {
    next(err);
  }
});

// Get pending consultation requests
router.get("/consultations/pending", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;

    const pending = await Consultation.find({
      doctor: doctorId,
      status: "active",
      acceptedAt: { $exists: false },
    })
      .populate("patient", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(pending);
  } catch (err) {
    next(err);
  }
});

// Get active consultations
router.get("/consultations/active", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;

    const active = await Consultation.find({
      doctor: doctorId,
      status: "active",
      acceptedAt: { $exists: true },
    })
      .populate("patient", "name email")
      .sort({ acceptedAt: -1 })
      .lean();

    res.json(active);
  } catch (err) {
    next(err);
  }
});

// Get consultation history
router.get("/consultations/history", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const limit = parseInt(req.query.limit as string) || 50;

    const history = await Consultation.find({
      doctor: doctorId,
      status: "ended",
    })
      .populate("patient", "name email")
      .sort({ endedAt: -1 })
      .limit(limit)
      .lean();

    res.json(history);
  } catch (err) {
    next(err);
  }
});

// Accept consultation request
router.post("/consultations/:id/accept", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const consultationId = req.params.id;

    const consultation = await Consultation.findOne({
      _id: consultationId,
      doctor: doctorId,
      status: "active",
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (consultation.acceptedAt) {
      return res.status(400).json({ message: "Consultation already accepted" });
    }

    consultation.acceptedAt = new Date();
    await consultation.save();

    // Emit acceptance to patient
    const { io } = await import("../server");
    io.to(consultationId).emit("consultation:accepted", {
      consultationId,
      doctorId,
    });

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

// Reject consultation request
router.post("/consultations/:id/reject", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const consultationId = req.params.id;

    const consultation = await Consultation.findOne({
      _id: consultationId,
      doctor: doctorId,
      status: "active",
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    consultation.status = "ended";
    consultation.endedAt = new Date();
    await consultation.save();

    // Emit rejection to patient
    const { io } = await import("../server");
    io.to(consultationId).emit("consultation:rejected", {
      consultationId,
      doctorId,
    });

    res.json({ message: "Consultation rejected" });
  } catch (err) {
    next(err);
  }
});

// Mark consultation as emergency
router.patch("/consultations/:id/emergency", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const consultationId = req.params.id;
    const { isEmergency } = req.body as { isEmergency?: boolean };

    const consultation = await Consultation.findOne({
      _id: consultationId,
      doctor: doctorId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    consultation.isEmergency = isEmergency ?? true;
    await consultation.save();

    // Emit emergency status change
    const { io } = await import("../server");
    io.to(consultationId).emit("consultation:emergency-updated", {
      consultationId,
      isEmergency: consultation.isEmergency,
    });

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

// Get single consultation
router.get("/consultations/:id", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const consultationId = req.params.id;

    const consultation = await Consultation.findOne({
      _id: consultationId,
      doctor: doctorId,
    })
      .populate("patient", "name email")
      .populate("doctor", "name specialization phone")
      .lean();

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

// Update consultation with notes/prescription
router.patch("/consultations/:id", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const consultationId = req.params.id;
    const { doctorNotes, prescription, followUpInstructions } = req.body as {
      doctorNotes?: string;
      prescription?: string;
      followUpInstructions?: string;
    };

    const consultation = await Consultation.findOne({
      _id: consultationId,
      doctor: doctorId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (doctorNotes !== undefined) consultation.doctorNotes = doctorNotes;
    if (prescription !== undefined) consultation.prescription = prescription;
    if (followUpInstructions !== undefined) consultation.followUpInstructions = followUpInstructions;

    await consultation.save();

    // Emit update to patient
    const { io } = await import("../server");
    io.to(consultationId).emit("consultation:updated", {
      consultationId,
      doctorNotes: consultation.doctorNotes,
      prescription: consultation.prescription,
      followUpInstructions: consultation.followUpInstructions,
    });

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

// End consultation
router.post("/consultations/:id/end", async (req, res, next) => {
  try {
    const doctorId = req.doctor!.doctorId;
    const consultationId = req.params.id;

    const consultation = await Consultation.findOne({
      _id: consultationId,
      doctor: doctorId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    consultation.status = "ended";
    consultation.endedAt = new Date();
    await consultation.save();

    // Emit end event to patient
    const { io } = await import("../server");
    io.to(consultationId).emit("consultation:end", {
      consultationId,
    });

    res.json(consultation);
  } catch (err) {
    next(err);
  }
});

export default router;

