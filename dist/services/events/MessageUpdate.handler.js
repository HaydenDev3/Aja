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
const GuildSetting_1 = require("../../database/models/GuildSetting");
const Deps_1 = __importDefault(require("../../utils/Deps"));
const Log_1 = __importDefault(require("../../utils/Log"));
const MessageFiltering_Shield_1 = __importDefault(
  require("../modules/MessageFiltering.Shield")
);
exports.default = new (class MessageCreateHandler {
  constructor(
    commands = Deps_1.default.get(Commands_service_1.default),
    client = Deps_1.default.get(discord_js_1.Client),
    messageFiltering = Deps_1.default.get(MessageFiltering_Shield_1.default)
  ) {
    this.commands = commands;
    this.client = client;
    this.messageFiltering = messageFiltering;
    this.on = "messageUpdate";
    this.type = 2;
    this.invoke = (oldMessage, newMessage) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
          if (!newMessage.author || newMessage.author.bot) return;
          const savedGuild =
            (yield GuildSetting_1.GuildSettings.findOne({
              _id:
                (_a = newMessage.guild) === null || _a === void 0
                  ? void 0
                  : _a.id,
            })) ||
            new GuildSetting_1.GuildSettings({
              _id:
                (_b = newMessage.guild) === null || _b === void 0
                  ? void 0
                  : _b.id,
            });
          if (oldMessage.content === newMessage.content) return;
          const isCommand = () =>
            newMessage.content.startsWith(savedGuild.general.prefix || "!");
          if (isCommand()) {
            const args = newMessage.content
              .slice(savedGuild.general.prefix.length || 1)
              .trim()
              .split(/ + /g);
            const cmd = args.shift().toLowerCase();
            let command = this.commands.commands.get(
              cmd || this.commands.aliases.get(cmd)
            );
            if (!command) return;
            const slicedContent =
              newMessage === null || newMessage === void 0
                ? void 0
                : newMessage.content.slice(
                    savedGuild.general.prefix.length || 1
                  );
            yield command.invoke(
              this.client,
              newMessage,
              ...this.commands.getCommandArgs(slicedContent)
            );
            Log_1.default.command(command, newMessage.author);
          } else {
            yield this.messageFiltering.init(newMessage);
          }
        } catch (err) {
          Log_1.default.fail(err.message, "commands");
        }
      });
  }
})();
