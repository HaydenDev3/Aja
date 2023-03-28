import mongoose from "mongoose";

const membersSchema = new mongoose.Schema({
  _id: String,
  exp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

export interface MemberDocument extends mongoose.Document {
  _id: string;
  exp: number;
  level: number;
}

export const SavedMember = mongoose.model<MemberDocument>(
  "members",
  membersSchema
);
