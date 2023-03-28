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
exports.default = new (class DeveloperInfoCommand {
  constructor() {
    this.data = new discord_js_1.SlashCommandBuilder()
      .setName("developer")
      .setDescription("Recieve information about the developer of this bot.");
    this.invoke = (client, interaction) =>
      __awaiter(this, void 0, void 0, function* () {
        const embed = new discord_js_1.EmbedBuilder()
          .setTitle("Hayden")
          .setURL("https://haydenf.cloud")
          .setDescription(
            `> <:replycontinue:998771075427094539> 👋 Hola, I am Hayden, [he/him].\n> <:replycontinue:998771075427094539> Contact me @ \`hayden@haydenf.cloud\`\n> <:reply:878577643300204565> Vist [My Website](https://www.haydenf.cloud/)`
          );
        const components = new discord_js_1.ActionRowBuilder().addComponents([
          new discord_js_1.ButtonBuilder()
            .setLabel(`Website`)
            .setDisabled(false)
            .setURL("https://www.haydenf.cloud")
            .setStyle(discord_js_1.ButtonStyle.Link),
          new discord_js_1.ButtonBuilder()
            .setLabel(`Invite Aja`)
            .setDisabled(true)
            .setURL("https://aja.haydenf.cloud")
            .setStyle(discord_js_1.ButtonStyle.Link),
        ]);
        yield interaction
          .followUp({
            embeds: [embed],
            components: [components],
          })
          .catch(() => {});
      });
  }
})();
