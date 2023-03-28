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
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const GuildSetting_1 = require("../../database/models/GuildSetting");
exports.default = new (class ModerationModuleSelectHandler {
  constructor() {
    this.on = "interactionCreate";
    this.type = 2;
    this.invoke = (interaction) =>
      __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isStringSelectMenu()) return;
        const customIds = [
          "moderation",
          "verification",
          "member_clearance",
          "message_filtering",
          "raidshield",
          "nickname_filtering",
        ];
        if (!customIds.includes(interaction.customId)) return;
        var savedGuild = yield GuildSetting_1.GuildSettings.findOne({
          _id: interaction.guildId,
        });
        if (!savedGuild) return;
        let embed = new builders_1.EmbedBuilder();
        switch (interaction.customId) {
          case customIds[0]: {
            yield interaction.followUp({
              embeds: [
                embed
                  .setTitle(`Moderation Module`)
                  .setColor(discord_js_1.Colors.Blurple)
                  .setDescription(
                    `> ***SELECT WHAT YOU WANT TO CONFIGURE BELOW***\n\n> ${
                      savedGuild.antiSpam
                        ? "<:icons_Correct:1043319634776047667>"
                        : "<:icons_Wrong:1043319853039222916>"
                    } Spam Shield\n> ${
                      savedGuild.messageFiltering.enabled
                        ? "<:icons_Correct:1043319634776047667>"
                        : "<:icons_Wrong:1043319853039222916>"
                    } Message Filtering\n> ${
                      savedGuild.memberClearance.enabled
                        ? "<:icons_Correct:1043319634776047667>"
                        : "<:icons_Wrong:1043319853039222916>"
                    } Member Clearance\n> ${
                      savedGuild.raidShield.enabled
                        ? "<:icons_Correct:1043319634776047667>"
                        : "<:icons_Wrong:1043319853039222916>"
                    } Raid Shield`
                  ),
              ],
              components: [
                {
                  type: 1,
                  components: [
                    {
                      type: 3,
                      placeholder: "Select a module you'd like to edit.",
                      customId: "moderation_select",
                      options: [
                        {
                          label: "Spam Shield",
                          emoji: savedGuild.antiSpam.enabled
                            ? "1043319634776047667"
                            : "1043319853039222916",
                          value: "spamshield",
                          description:
                            "Modify the Spam Shield within the Moderation Module.",
                        },
                        {
                          label: "Raid Shield",
                          emoji: savedGuild.raidShield.enabled
                            ? "1043319634776047667"
                            : "1043319853039222916",
                          value: "raidShield",
                          description:
                            "Modify the Raid Shield within the Moderation Module.",
                        },
                        {
                          label: "Message Filtering",
                          emoji: savedGuild.messageFiltering.enabled
                            ? "1043319634776047667"
                            : "1043319853039222916",
                          value: "message_filtering",
                          description:
                            "Modify Message Filtering setting within the Moderation Module.",
                        },
                        {
                          label: "Member Clearance",
                          emoji: savedGuild.memberClearance.enabled
                            ? "1043319634776047667"
                            : "1043319853039222916",
                          value: "member_clearance",
                          description:
                            "Modify the Member Clearance setting within the Moderation Module.",
                        },
                      ],
                    },
                  ],
                },
              ],
            });
            break;
          }
        }
      });
  }
})();
