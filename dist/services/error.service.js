"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = __importDefault(require("../utils/Log"));
const registering_service_1 = __importDefault(require("./registering.service"));
class AntiCrashService extends registering_service_1.default {
  constructor() {
    super(...arguments);
    this.handleUncaughtException = (error, origin) => {
      Log_1.default.fail(`Uncaught Exception:\n${error}\nOrigin:\n${origin}`);
    };
    this.handleUnhandledRejection = (reason, promise) => {
      Log_1.default.fail(`Unhandled Rejection:\n${reason}`);
    };
  }
  start() {
    process.on("uncaughtException", this.handleUncaughtException);
    process.on("unhandledRejection", this.handleUnhandledRejection);
  }
  stop() {
    process.off("uncaughtException", this.handleUncaughtException);
    process.off("unhandledRejection", this.handleUnhandledRejection);
  }
}
exports.default = AntiCrashService;
