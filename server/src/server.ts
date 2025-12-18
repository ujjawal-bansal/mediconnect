import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import doctorRoutes from "./routes/doctors";
import consultationRoutes from "./routes/consultations";
import firstAidRoutes from "./routes/firstAid";
import hospitalRoutes from "./routes/hospitals";
import aiRoutes from "./routes/ai";
import { registerConsultationHandlers } from "./socket/consultation";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

import doctorAuthRoutes from "./routes/doctorAuth";
import doctorRoutes from "./routes/doctor";

app.use("/api/auth", authRoutes);
app.use("/api/doctor/auth", doctorAuthRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/firstaid", firstAidRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// TODO: set up Socket.IO consultation handlers

const start = async () => {
  await connectDB();
  registerConsultationHandlers();
  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

void start();

