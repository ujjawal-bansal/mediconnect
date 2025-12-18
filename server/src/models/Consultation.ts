import mongoose, { Document, Schema } from "mongoose";

export type ConsultationMode = "chat" | "audio" | "video";
export type ConsultationStatus = "active" | "ended";

export interface IMessage {
  sender: "patient" | "doctor" | "system";
  text: string;
  timestamp: Date;
}

export interface IConsultation extends Document {
  patient: mongoose.Types.ObjectId;
  patientName?: string;
  patientPhone?: string;
  doctor: mongoose.Types.ObjectId;
  mode: ConsultationMode;
  symptoms: string;
  messages: IMessage[];
  status: ConsultationStatus;
  isEmergency?: boolean;
  doctorNotes?: string;
  prescription?: string;
  followUpInstructions?: string;
  startedAt: Date;
  endedAt?: Date;
  acceptedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      enum: ["patient", "doctor", "system"],
      required: true,
    },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ConsultationSchema = new Schema<IConsultation>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String },
    patientPhone: { type: String },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    mode: {
      type: String,
      enum: ["chat", "audio", "video"],
      required: true,
    },
    symptoms: { type: String, required: true },
    messages: { type: [MessageSchema], default: [] },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    isEmergency: { type: Boolean, default: false },
    doctorNotes: { type: String },
    prescription: { type: String },
    followUpInstructions: { type: String },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    acceptedAt: { type: Date },
  },
  { timestamps: true },
);

export const Consultation = mongoose.model<IConsultation>(
  "Consultation",
  ConsultationSchema,
);

