import mongoose from "mongoose";

export interface Infraction {
  guildId: string;
  memberId: string;
  reason: string;
  date: Date;
}

export interface InfractionDocument extends mongoose.Document, Infraction {
  guildId: string;
  memberId: string;
  reason: string;
  date: Date;
}

const InfractionSchema = new mongoose.Schema<InfractionDocument>({
  guildId: { type: String, required: true },
  memberId: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
});

export const InfractionModel = mongoose.model<InfractionDocument>(
  "infractions",
  InfractionSchema
);
