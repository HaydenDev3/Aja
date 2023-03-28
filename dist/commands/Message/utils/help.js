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
const fs_1 = __importDefault(require("fs"));
const Config_1 = __importDefault(require("../../../utils/Config"));
exports.default = new (class HelpCommand {
  constructor() {
    this.data = {
      name: "help",
      summary: "Recieve help upon using this command.",
    };
    this.invoke = (client, message) =>
      __awaiter(this, void 0, void 0, function* () {
        yield message.channel.sendTyping().catch(() => {});
        const imageBuffer = fs_1.default.readFileSync(
          `${__dirname}/help_command.png`
        );
        const image = new discord_js_1.AttachmentBuilder(imageBuffer, {
          name: "help_command.png",
        });
        yield message.reply({
          content: `> ${Config_1.default.emojis.unicode.reply} Hey ${message.author.username}, Kindly use ${Config_1.default.emojis.unicode.slashCommand} To Indoor Your Journey.`,
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
          files: [image],
        });
      });
  }
})();
