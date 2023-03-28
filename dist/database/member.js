"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedMember = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const membersSchema = new mongoose_1.default.Schema({
  _id: String,
  exp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});
exports.SavedMember = mongoose_1.default.model("members", membersSchema);
