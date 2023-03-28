"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Config_1 = __importDefault(require("../utils/Config"));
const Log_1 = __importDefault(require("../utils/Log"));
const registering_service_1 = __importDefault(require("./registering.service"));
class EventsRegistery extends registering_service_1.default {
  constructor() {
    super();
    this.handlers = [];
    Config_1.default.database.uri, Config_1.default.database.options;
    return this;
  }
  init() {
    return __awaiter(this, void 0, void 0, function* () {
      const events = yield this.readdir(`${__dirname}/events`);
      for (const file of events.filter((file) => file.endsWith(".ts"))) {
        const handler = yield this.importFile(`./events/${file}`);
        if (!handler) return;
        if (handler.type === 1) {
          if (mongoose_1.default.connection) {
            mongoose_1.default.connection.on(
              handler.on,
              handler.invoke.bind(handler)
            );
          } else if (handler.type === 2) {
            Log_1.default.warn(
              `Skipping "${handler.on}" event handler as there is no Mongoose connection.`,
              "handlers"
            );
          }
        } else {
          this.client.on(handler.on, handler.invoke.bind(handler));
          this.handlers.push(handler);
        }
      }
      Log_1.default.info(
        `Loaded: ${this.handlers.length} handlers.`,
        "handlers"
      );
    });
  }
}
exports.default = EventsRegistery;
