"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Achievement = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const achievementSchema = new mongoose_1.default.Schema({
  userId: String,
  achievementName: String,
  achievementDescription: String,
  achievementDate: Date,
});
exports.Achievement = mongoose_1.default.model(
  "Achievement",
  achievementSchema
);
