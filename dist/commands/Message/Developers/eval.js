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
const util_1 = require("util");
const Config_1 = __importDefault(require("../../../utils/Config"));
const Log_1 = __importDefault(require("../../../utils/Log"));
exports.default = new (class EvalCommand {
  constructor() {
    this.data = {
      name: "eval",
      summary: "Eval rows/or lines of code.",
      permissions: [],
      cooldown: 5000,
    };
    this.invoke = (client, message, code) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield message.channel.sendTyping();
        if (!Config_1.default.discord.ownerIds.includes(message.author.id)) {
          yield message.channel.send({
            content: `> <a:Alert:936155561878245397> This is owner only`,
          });
          return;
        }
        if (!code) {
          yield message.channel.send({
            content: `> <a:Alert:936155561878245397> You need to specifiy some **code** to evaluate on.`,
          });
          return;
        }
        try {
          const result = yield eval(code);
          let output = result;
          if (typeof result !== "string") {
            output = (0, util_1.inspect)(result);
          }
          yield message.channel.send({
            content: `> Eval Response:\n${(0, discord_js_1.codeBlock)(output)}`,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    label: "Hide Message",
                    customId: "hide_message",
                    disabled: false,
                    emoji: "1008179260621590528",
                    style: discord_js_1.ButtonStyle.Secondary,
                  },
                ],
              },
            ],
          });
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
