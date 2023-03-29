import { Guild, Snowflake } from "discord.js";
import mongoose, { Document, Schema } from "mongoose";

interface MemberDocument extends Document {
  likes: string[];
  votes: number;
}

export default mongoose.model<MemberDocument>(
  "member",
  new Schema({
    likes: {
      type: [String],
      required: true,
      unique: true,
      default: [],
    },
    votes: {
      type: Number,
      unique: true,
      default: 0,
    },
  })
);
