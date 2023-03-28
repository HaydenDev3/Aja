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
const Config_1 = __importDefault(require("../../../utils/Config"));
const Log_1 = __importDefault(require("../../../utils/Log"));
exports.default = new (class EmitCommand {
  constructor() {
    this.data = {
      name: "emit",
      summary:
        "Emit a custom event with specified parameters to trigger custom functionality.",
      permissions: [],
      cooldown: 5000,
    };
    this.invoke = (client, message, eventName, params) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield message.channel.sendTyping();
        if (!eventName) {
          yield message.reply(
            `> <:icons_Wrong:1043319853039222916> You need to provide an **Event Name** to execute!`
          );
          return;
        }
        if (!params.length) {
          yield message.reply(
            `> <:icons_Wrong:1043319853039222916> You need to provide some **Params** to execute \`${eventName}\`!`
          );
          return;
        }
        if (!Config_1.default.discord.ownerIds.includes(message.author.id))
          return;
        try {
          client.emit(eventName, ...(yield eval(params)));
          let sortedParams = Object.keys(params)
            .sort()
            .map((key) => `\`${key}\``)
            .join(", ");
          message.channel.send(
            `<a:success:878493950154002452> Successfully emitted event \`${eventName}\` with params ${sortedParams}`
          );
        } catch (error) {
          yield message.channel.send(
            `> <a:Alert:936155561878245397> An Error was detected\n${(0,
            discord_js_1.codeBlock)(
              (_a = error.message) !== null && _a !== void 0
                ? _a
                : "Unknown Error"
            )}`
          );
          Log_1.default.fail(error.stack, "commands");
        }
      });
  }
})();
