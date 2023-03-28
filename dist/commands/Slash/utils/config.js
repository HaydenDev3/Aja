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
const GuildSetting_1 = require("../../../database/models/GuildSetting");
const Log_1 = __importDefault(require("../../../utils/Log"));
exports.default = new (class ConfigCommand {
  constructor() {
    this.data = new discord_js_1.SlashCommandBuilder()
      .setName("config")
      .setDescription("Indoor your server's journey...")
      .setDMPermission(false)
      .setNSFW(false);
    this.invoke = (client, interaction) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        let embed = new discord_js_1.EmbedBuilder()
          .setThumbnail(
            "https://cdn.discordapp.com/emojis/859388128040976384.webp?size=240&quality=lossless"
          )
          .setTitle(`Loading settings...`)
          .setDescription("> Please be patient while I get the settings...")
          .setColor(discord_js_1.Colors.Blurple);
        const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
          _id: interaction.guildId,
        });
        const message = yield interaction.followUp({
          embeds: [embed],
        });
        if (!savedGuild) {
          new GuildSetting_1.GuildSettings({ _id: interaction.guildId });
          return console.log(message);
        }
        embed = new discord_js_1.EmbedBuilder()
          .setThumbnail(
            "https://cdn.discordapp.com/emojis/859388128040976384.webp?size=240&quality=lossless"
          )
          .setTitle(
            `Config for ${
              (_a = interaction.guild) === null || _a === void 0
                ? void 0
                : _a.name
            }`
          )
          .setDescription(
            `> ***In-order to start editing your server configuration, use the select menu below.***\n> ${
              savedGuild.general.enabled
                ? "<:icons_Correct:1043319634776047667>"
                : "<:icons_Wrong:1043319853039222916>"
            } General\n> ${
              savedGuild.onboarding.enabled
                ? "<:icons_Correct:1043319634776047667>"
                : "<:icons_Wrong:1043319853039222916>"
            } Onboarding\n> ${
              savedGuild.welcoming.enabled
                ? "<:icons_Correct:1043319634776047667>"
                : "<:icons_Wrong:1043319853039222916>"
            } Welcoming\n> ${
              savedGuild.messageFiltering.enabled
                ? "<:icons_Correct:1043319634776047667>"
                : "<:icons_Wrong:1043319853039222916>"
            } Message Filtering\n> ${
              savedGuild.antiSpam.enabled
                ? "<:icons_Correct:1043319634776047667>"
                : "<:icons_Wrong:1043319853039222916>"
            } Spam Shield`
          )
          .setColor(discord_js_1.Colors.Blurple);
        try {
          setTimeout(
            () =>
              __awaiter(this, void 0, void 0, function* () {
                yield message.edit({
                  embeds: [embed],
                  components: [
                    {
                      type: 1,
                      components: [
                        {
                          type: 3,
                          placeholder: "Select a module to edit",
                          customId: "config",
                          options: [
                            {
                              label: "General Module",
                              value: "general",
                              emoji: savedGuild.general.enabled
                                ? "1043319634776047667"
                                : "1043319853039222916",
                            },
                            {
                              label: "Onboarding Module",
                              value: "onboarding",
                              emoji: savedGuild.onboarding.enabled
                                ? "1043319634776047667"
                                : "1043319853039222916",
                            },
                            {
                              label: "Welcoming Module",
                              value: "welcoming",
                              emoji: savedGuild.welcoming.enabled
                                ? "1043319634776047667"
                                : "1043319853039222916",
                            },
                            {
                              label: "Moderation Module",
                              value: "moderation",
                              emoji: savedGuild.messageFiltering.enabled
                                ? "1043319634776047667"
                                : "1043319853039222916",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                });
              }),
            3000
          );
        } catch (err) {
          Log_1.default.fail(err, "commands");
        }
      });
  }
})();
