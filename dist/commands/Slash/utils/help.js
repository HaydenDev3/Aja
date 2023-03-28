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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = new (class HelpCommand {
  constructor() {
    this.data = new discord_js_1.SlashCommandBuilder()
      .setName("help")
      .setDescription("Recieve help upon using this command.")
      .setDMPermission(true);
    this.invoke = (client, interaction) =>
      __awaiter(this, void 0, void 0, function* () {
        yield interaction.followUp({
          content: `> <:reply:878577643300204565> Hey ${interaction.user.username}, Please be patient, this Command is still in the works.`,
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
      });
  }
})();
