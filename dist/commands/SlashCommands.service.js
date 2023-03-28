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
const glob_1 = require("glob");
class SlashCommandService extends registering_service_1.default {
  constructor() {
    super();
    this.appCmds = [];
    return this;
  }
  init() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const slashCommandFiles = (0, glob_1.sync)(`${__dirname}/Slash/**/*.ts`);
      for (const file of slashCommandFiles) {
        const command = yield this.importFile(file);
        if (
          !command ||
          !(command === null || command === void 0 ? void 0 : command.data)
        )
          return;
        this.slashCommands.set(
          (_a = command.data) === null || _a === void 0 ? void 0 : _a.name,
          command
        );
        this.appCmds.push(command.data);
      }
    });
  }
}
exports.default = SlashCommandService;
