import { EmbedBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  ClientEvents,
  Colors,
  StringSelectMenuInteraction,
} from "discord.js";
import { GuildSettings } from "../../database/models/GuildSetting";
import { EventType, IEvent } from "../events.service";

export default new (class ModerationModuleSelectHandler implements IEvent {
  on: keyof ClientEvents = "interactionCreate";
  type: EventType = 2;

  invoke = async (interaction: StringSelectMenuInteraction) => {
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

    var savedGuild = await GuildSettings.findOne({ _id: interaction.guildId });
    if (!savedGuild) return;

    let embed = new EmbedBuilder();
    switch (interaction.customId) {
      case customIds[0]: {
        await interaction.followUp({
          embeds: [
            embed
              .setTitle(`Moderation Module`)
              .setColor(Colors.Blurple)
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
  };
})();
