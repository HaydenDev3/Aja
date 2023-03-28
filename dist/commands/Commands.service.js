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
const registering_service_1 = __importDefault(
  require("../services/registering.service")
);
const fs_1 = __importDefault(require("fs"));
const Log_1 = __importDefault(require("../utils/Log"));
class MessageCommandService extends registering_service_1.default {
  constructor() {
    super();
    return this;
  }
  init() {
    return __awaiter(this, void 0, void 0, function* () {
      fs_1.default.readdirSync(`${__dirname}/Message/`).forEach((dir) =>
        __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c;
          const commandFiles = fs_1.default
            .readdirSync(`${__dirname}/Message/${dir}/`)
            .filter((file) => file.endsWith(".ts"));
          for (const file of commandFiles) {
            const command = yield this.importFile(
              `${__dirname}/Message/${dir}/${file}`
            );
            if (!command) continue;
            this.commands.set(
              (_a = command.data) === null || _a === void 0 ? void 0 : _a.name,
              command
            );
            if (
              (_b = command.data) === null || _b === void 0
                ? void 0
                : _b.aliases
            )
              (_c = command.data) === null || _c === void 0
                ? void 0
                : _c.aliases.forEach((alias) =>
                    this.aliases.set(alias, command.data.name)
                  );
          }
        })
      );
      Log_1.default.info(
        `Loaded: ${this.commands.size} Message Commands`,
        "commands"
      );
    });
  }
  getCommandArgs(slicedContent) {
    return slicedContent.split(" ").slice(1);
  }
}
exports.default = MessageCommandService;
