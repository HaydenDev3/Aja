"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedInvite = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InviteSchema = new mongoose_1.default.Schema({
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
exports.SavedInvite = mongoose_1.default.model("invites", InviteSchema);
