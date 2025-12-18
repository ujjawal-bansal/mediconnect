import { Socket } from "socket.io";
import { io } from "../server";
import { Consultation } from "../models/Consultation";

export const registerConsultationHandlers = (): void => {
  io.on("connection", (socket: Socket) => {
    socket.on("joinConsultation", (consultationId: string) => {
      socket.join(consultationId);
    });

    socket.on(
      "message:send",
      async (payload: {
        consultationId: string;
        sender: "patient" | "doctor";
        text: string;
      }) => {
        const { consultationId, sender, text } = payload;
        if (!consultationId || !text) return;

        const consultation = await Consultation.findById(consultationId);
        if (!consultation || consultation.status === "ended") return;

        const message = {
          sender,
          text,
          timestamp: new Date(),
        };

        consultation.messages.push(message);
        await consultation.save();

        // Broadcast to all participants in the room (including sender for confirmation)
        io.to(consultationId).emit("message:new", {
          consultationId,
          ...message,
        });
      },
    );

    // WebRTC signaling events – Socket.IO used only as the signaling channel.
    socket.on(
      "webrtc:offer",
      (payload: { consultationId: string; sdp: RTCLocalSessionDescriptionInit }) => {
        if (!payload.consultationId || !payload.sdp) return;
        socket.to(payload.consultationId).emit("webrtc:offer", payload);
      },
    );

    socket.on(
      "webrtc:answer",
      (payload: { consultationId: string; sdp: RTCSessionDescriptionInit }) => {
        if (!payload.consultationId || !payload.sdp) return;
        socket.to(payload.consultationId).emit("webrtc:answer", payload);
      },
    );

    socket.on(
      "webrtc:ice-candidate",
      (payload: { consultationId: string; candidate: RTCIceCandidateInit }) => {
        if (!payload.consultationId || !payload.candidate) return;
        socket.to(payload.consultationId).emit("webrtc:ice-candidate", payload);
      },
    );

    socket.on("consultation:end", (consultationId: string) => {
      if (!consultationId) return;
      socket.to(consultationId).emit("consultation:end", { consultationId });
    });
  });
};

