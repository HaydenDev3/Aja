"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const Deps_1 = __importDefault(require("../utils/Deps"));
const glob_1 = require("glob");
const Log_1 = __importDefault(require("../utils/Log"));
class RegisteringService {
  constructor() {
    this.readdir = util_1.default.promisify(fs_1.default.readdir);
    this.client = Deps_1.default.get(discord_js_1.Client);
    this.commands = new discord_js_1.Collection();
    this.slashCommands = new discord_js_1.Collection();
    this.globPromise = util_1.default.promisify(glob_1.glob);
    this.aliases = new discord_js_1.Collection();
    this.rest = new discord_js_1.REST({ version: "10" }).setToken(
      this.client.token
    );
  }
  refreshCommands(clientId, guildId) {
    return __awaiter(this, void 0, void 0, function* () {
      const { messageCommands, slashCommands } = yield this.getCommands();
      if (guildId) {
        yield this.rest.put(
          discord_js_1.Routes.applicationGuildCommands(clientId, guildId),
          {
            body: slashCommands,
          }
        );
      } else {
        yield this.rest.put(discord_js_1.Routes.applicationCommands(clientId), {
          body: slashCommands,
        });
      }
      Log_1.default.info("Refreshed (/) Slash Commands", "commands");
    });
  }
  getCommands() {
    return __awaiter(this, void 0, void 0, function* () {
      return {
        slashCommands: this.slashCommands,
        messageCommands: this.commands,
      };
    });
  }
  importFile(file) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      var _b;
      return (_a = yield ((_b = file),
      Promise.resolve().then(() => __importStar(require(_b))))) === null ||
        _a === void 0
        ? void 0
        : _a.default;
    });
  }
}
exports.default = RegisteringService;
