import mongoose, { Document, Schema } from "mongoose";

export interface PremiumSettings {
  guildId: string;
  premiumExpiration: Date;
  premiumUsers: string[]; // Array of user IDs
  isPremium: boolean;
  updatedAt: Date;
}

export interface PremiumSettingsDocument extends PremiumSettings, Document {}

const PremiumSettingsSchema = new Schema<PremiumSettingsDocument>({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  premiumExpiration: {
    type: Date,
    required: true,
  },
  premiumUsers: {
    type: [String],
    default: [],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    unique: false,
    required: false,
  },
});

export const PremiumSettingsModel = mongoose.model<PremiumSettingsDocument>(
  "PremiumSettings",
  PremiumSettingsSchema
);
