import mongoose, { Document, Schema } from "mongoose";

export type HospitalResourceType = "hospital" | "clinic" | "pharmacy";

export interface IHospitalResource extends Document {
  name: string;
  type: HospitalResourceType;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  openHours?: string;
}

const HospitalResourceSchema = new Schema<IHospitalResource>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["hospital", "clinic", "pharmacy"],
      required: true,
    },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String },
    openHours: { type: String },
  },
  { timestamps: true },
);

export const HospitalResource = mongoose.model<IHospitalResource>(
  "HospitalResource",
  HospitalResourceSchema,
);

