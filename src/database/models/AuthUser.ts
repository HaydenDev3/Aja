import { Guild } from 'discord.js';
import mongoose, { Document, Schema } from 'mongoose';

interface UserDocument extends Document {
  discordId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  username: string;
  avatar: string;
  guilds: Guild[];
}

const UserSchema: Schema = new Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  guilds: [
    {
      type: Array,
      required: true,
    },
  ],
});

export default mongoose.model<UserDocument>('AuthUser', UserSchema);
