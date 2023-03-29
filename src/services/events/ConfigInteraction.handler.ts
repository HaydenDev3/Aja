import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ClientEvents,
  Colors,
  EmbedBuilder,
  MessageComponentInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { configMessage } from "../../commands/Slash/utils/ConfigCommand";
import { GuildSettings } from "../../database/models/GuildSetting";
import config from "../../utils/Config";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";

export default new (class ConfigInteractionHandler implements IEvent {
  on: keyof ClientEvents = "interactionCreate";
  type: EventType = 2;

  invoke = async (interaction: MessageComponentInteraction) => {
    if (!interaction.deferred)
      await interaction.deferReply({ ephemeral: false });

    const savedGuild = await GuildSettings.findOne({
      _id: interaction.guildId,
    });

    if (!savedGuild) {
      await interaction.followUp({
        content: `${config.emojis.unicode.wrong} Failed to load guild settings: Guild is not registered, please use ${config.emojis.unicode.slashCommand} \`/register\``,
        ephemeral: true,
      });
      return;
    }

    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "export_guild_data": {
          const data = savedGuild?.toJSON();
          const jsonData = JSON.stringify(data);

          const attachment = new AttachmentBuilder(Buffer.from(jsonData), {
            name: `${interaction.guild!.id}.json`,
          });

          await interaction.followUp({
            content: "Here is the guild data.",
            files: [attachment],
            ephemeral: true,
          });
          break;
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      const [value] = interaction.values as any;
      var ToggleModule: string = "";

      if (value.includes("toggle")) ToggleModule = value.split("-")[1];

      switch (interaction.customId) {
        case "config": {
          switch (value) {
            case `toggle-${ToggleModule}`: {
              const module = savedGuild[ToggleModule] as any;

              module!.enabled = !module.enabled;
              await savedGuild.save();

              await interaction.followUp({
                content: `> ${
                  config.emojis.unicode.correct
                } Successfully toggled ${
                  module?.enabled ? "on" : "off"
                } ${value} module.`,
                ephemeral: true,
              });
              break;
            }
            case "general": {
              await interaction.followUp({
                embeds: [
                  new EmbedBuilder()
                    .setThumbnail(
                      "https://cdn.discordapp.com/emojis/866599434098835486.webp?size=96&quality=lossless"
                    )
                    .setTitle(`General Settings`)
                    .setDescription(
                      `> ***START EDITING THE GENERAL MODULE BY SELECTING SOMETHING BELOW*** ${
                        config.emojis.unicode.shine
                      }\n\n> ${
                        savedGuild.general.enabled
                          ? config.emojis.unicode.on
                          : config.emojis.unicode.off
                      } Toggle\n> ${config.emojis.unicode.replycontinue} \`${
                        savedGuild.general.prefix
                      }\` Prefix\n> ${config.emojis.unicode.reply} \`${
                        interaction.guild?.roles.cache.get(
                          savedGuild.general.holdRoleId as string
                        ) || "None"
                      }\` Hold Role`
                    )
                    .setColor(Colors.Blurple),
                ],
                components: [
                  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                      .setPlaceholder('Start editing module "general"')
                      .setCustomId("generalSettings")
                      .addOptions([
                        new StringSelectMenuOptionBuilder()
                          .setLabel("Toggle General")
                          .setValue("toggle-general")
                          .setDescription(
                            "Toggle General module on or off accordinly to your selection."
                          )
                          .setEmoji(
                            savedGuild.general.enabled
                              ? config.emojis.id.on
                              : config.emojis.id.off
                          ),
                        new StringSelectMenuOptionBuilder()
                          .setLabel("Prefix")
                          .setValue("prefix")
                          .setDescription("Edit the bot(s) prefix")
                          .setEmoji(config.emojis.id.vip),
                        new StringSelectMenuOptionBuilder()
                          .setLabel("Hold Role")
                          .setValue("holdRole")
                          .setEmoji(config.emojis.id.spark),
                      ])
                  ),
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setLabel("Export Data")
                      .setEmoji(config.emojis.id.files)
                      .setCustomId("export_guild_data")
                      .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                      .setLabel("Back")
                      .setEmoji("◀️")
                      .setCustomId("back")
                      .setStyle(ButtonStyle.Secondary)
                  ),
                ],
                ephemeral: true,
              });
            }
          }
        }
      }
    }
  };
})();
