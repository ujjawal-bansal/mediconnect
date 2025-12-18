import mongoose, { Document, Schema } from "mongoose";

export type FirstAidCategory =
  | "burns"
  | "heart_attack"
  | "bleeding"
  | "fracture"
  | "choking"
  | "fainting";

export interface IFirstAid extends Document {
  category: FirstAidCategory;
  title: string;
  icon: string;
  summary: string;
  steps: string[];
  disclaimer: string;
}

const FirstAidSchema = new Schema<IFirstAid>(
  {
    category: {
      type: String,
      enum: ["burns", "heart_attack", "bleeding", "fracture", "choking", "fainting"],
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    summary: { type: String, required: true },
    steps: [{ type: String, required: true }],
    disclaimer: { type: String, required: true },
  },
  { timestamps: true },
);

export const FirstAid = mongoose.model<IFirstAid>("FirstAid", FirstAidSchema);

