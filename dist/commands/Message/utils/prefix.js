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
const GuildSetting_1 = require("../../../database/models/GuildSetting");
const Config_1 = __importDefault(require("../../../utils/Config"));
exports.default = new (class HelpCommand {
  constructor() {
    this.data = {
      name: "prefix",
      summary:
        "This command allows the server manager to set a custom prefix for the bot's commands within a Discord server, providing flexibility and customization options for the server's users..",
      permissions: ["ManageGuild"],
    };
    this.invoke = (client, message) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield message.channel.sendTyping().catch(() => {});
        const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
          _id: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id,
        });
        if (!savedGuild)
          return yield message.reply(
            `> ${Config_1.default.emojis.unicode.wrong} This server isn't **registered** inside our **databases**, please use ${Config_1.default.emojis.unicode.slashCommand} \`/register\` command in-order to start your Journey.`
          );
        let prefix = savedGuild.general.prefix;
        if (!prefix) {
          return message.reply(
            `> ${Config_1.default.emojis.unicode.reply} The current prefix for this server is \`${savedGuild.general.prefix}\``
          );
        }
        if (prefix.length > 10) {
          return message.reply(
            `> ${Config_1.default.emojis.unicode.wrong} The prefix can't be longer than 10 characters.`
          );
        }
        savedGuild.general.prefix = prefix;
        yield savedGuild.save();
        yield message.reply(
          `> ${Config_1.default.emojis.unicode.correct} The prefix for this server has been set to \`${prefix}\`.`
        );
      });
  }
})();
