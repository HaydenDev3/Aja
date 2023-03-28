"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = __importDefault(require("../../utils/Log"));
exports.default = new (class MongooseConnectedHandler {
  constructor() {
    this.on = "error";
    this.type = 1;
    this.invoke = (error) => {
      Log_1.default.info(`Database Error:\n${error.stack}`, "db");
    };
  }
})();
