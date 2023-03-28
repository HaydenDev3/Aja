"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = __importDefault(require("../../utils/Log"));
exports.default = new (class MongooseDisconnectedHandler {
  constructor() {
    this.on = "disconnected";
    this.type = 1;
    this.invoke = () => {
      Log_1.default.info(`Database disconnected.`, "db");
    };
  }
})();
