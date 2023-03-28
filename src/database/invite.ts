import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema({
  guild: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  uses: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface InviteDocument extends mongoose.Document {
  guild: string;
  code: number;
  uses: number;
  createdAt: Date;
}

export const SavedInvite = mongoose.model<InviteDocument>(
  "invites",
  InviteSchema
);
