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
const discord_js_1 = require("discord.js");
const Commands_service_1 = __importDefault(
  require("../../commands/Commands.service")
);
const SlashCommands_service_1 = __importDefault(
  require("../../commands/SlashCommands.service")
);
const Config_1 = __importDefault(require("../../utils/Config"));
const Deps_1 = __importDefault(require("../../utils/Deps"));
const Log_1 = __importDefault(require("../../utils/Log"));
const Ticketing_service_1 = __importDefault(
  require("../modules/Ticketing.service")
);
exports.default = new (class ReadyHandler {
  constructor(
    SlashcommandService = Deps_1.default.get(SlashCommands_service_1.default),
    messageCommands = Deps_1.default.get(Commands_service_1.default)
  ) {
    this.SlashcommandService = SlashcommandService;
    this.messageCommands = messageCommands;
    this.on = "ready";
    this.type = 2;
    this.invoke = (bot) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        Log_1.default.info(`It's live!`, "launcher");
        yield this.messageCommands.init(); /** @INFO - Register Message Command Services */
        yield this.SlashcommandService.init(); /** @INFO - Register Slash Command sServices */
        new Ticketing_service_1.default();
        yield this.SlashcommandService.rest.put(
          discord_js_1.Routes.applicationGuildCommands(
            (_a = bot.user) === null || _a === void 0 ? void 0 : _a.id,
            "1043318603392483358"
          ),
          {
            body: this.SlashcommandService.appCmds,
          }
        );
        setInterval(() => {
          var _a;
          const status =
            Config_1.default.discord.messages[
              Math.floor(
                Math.random() * Config_1.default.discord.messages.length
              )
            ];
          (_a = bot.user) === null || _a === void 0
            ? void 0
            : _a.setActivity(status, {
                type: discord_js_1.ActivityType.Playing,
              });
        }, 30000);
        Log_1.default.info(
          `Loaded: ${this.SlashcommandService.commands.size} Guild (/) Commands`,
          "commands"
        );
      });
  }
})();
