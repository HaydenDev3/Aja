"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const registering_service_1 = __importDefault(
  require("../registering.service")
);
class SpamShield extends registering_service_1.default {
  constructor() {
    super();
  }
}
exports.default = SpamShield;
