"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfractionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InfractionSchema = new mongoose_1.default.Schema({
  guildId: { type: String, required: true },
  memberId: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
});
exports.InfractionModel = mongoose_1.default.model(
  "infractions",
  InfractionSchema
);
