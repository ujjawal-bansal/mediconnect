import mongoose, { Document, Schema } from "mongoose";

export type DoctorAvailability = "online" | "busy" | "offline";

export interface IDoctor extends Document {
  name: string;
  email: string;
  passwordHash: string;
  specialization: string;
  experienceYears: number;
  phone: string;
  languages: string[];
  hospital?: string;
  clinic?: string;
  modeAvailability: {
    chat: boolean;
    audio: boolean;
    video: boolean;
  };
  availability: DoctorAvailability;
  rating?: number;
  profileImageUrl?: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    specialization: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    phone: { type: String, required: true },
    languages: [{ type: String }],
    hospital: { type: String },
    clinic: { type: String },
    modeAvailability: {
      chat: { type: Boolean, default: true },
      audio: { type: Boolean, default: true },
      video: { type: Boolean, default: true },
    },
    availability: {
      type: String,
      enum: ["online", "busy", "offline"],
      default: "offline",
    },
    rating: { type: Number },
    profileImageUrl: { type: String },
  },
  { timestamps: true },
);

export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);

