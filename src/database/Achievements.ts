import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  userId: String,
  achievementName: String,
  achievementDescription: String,
  achievementDate: Date,
});

export interface IAchievement extends mongoose.Document {
  userId: string;
  achievementName: string;
  achievementDescription: string;
  achievementDate: Date;
}

export const Achievement = mongoose.model<IAchievement>(
  "Achievement",
  achievementSchema
);
