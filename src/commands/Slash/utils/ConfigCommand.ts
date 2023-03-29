import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ComponentType,
  EmbedBuilder,
  Message,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { GuildSettings } from "../../../database/models/GuildSetting";
import config from "../../../utils/Config";
import Log from "../../../utils/Log";
import SlashCommand from "../../SlashCommand";

export var configMessage: Message;

export default new (class ConfigCommand implements SlashCommand {
  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("config")
    .setDescription("Indoor your server's journey...")
    .setDMPermission(false)
    .setNSFW(false);

  invoke = async (client: Client, interaction: ChatInputCommandInteraction) => {
    let embed = new EmbedBuilder()
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/859388128040976384.webp?size=240&quality=lossless"
      )
      .setTitle(`Loading settings...`)
      .setDescription("> Please be patient while I get the settings...")
      .setColor(Colors.Blurple);

    const savedGuild = await GuildSettings.findOne({
      _id: interaction.guildId,
    });

    configMessage = await interaction.followUp({
      embeds: [embed],
      ephemeral: false,
    });

    if (!savedGuild)
      return await configMessage.edit({
        content: `${config.emojis.unicode.wrong} Failed to load guild settings: Guild is not registered, please use ${config.emojis.unicode.slashCommand} \`/register\``,
        embeds: [],
      });

    embed = new EmbedBuilder()
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/859388128040976384.webp?size=240&quality=lossless"
      )
      .setTitle(`Config for ${interaction.guild?.name}`)
      .setDescription(
        `> ***In-order to start editing your server configuration, use the select menu below.***\n> ${
          savedGuild.general.enabled
            ? config.emojis.unicode.on
            : config.emojis.unicode.off
        } General\n> ${
          savedGuild.logging.enabled
            ? config.emojis.unicode.on
            : config.emojis.unicode.off
        } Logging\n> ${
          savedGuild.shields.enabled
            ? config.emojis.unicode.on
            : config.emojis.unicode.off
        } Shields Module\n> ${
          savedGuild.contentFiltering.enabled
            ? config.emojis.unicode.on
            : config.emojis.unicode.off
        } Content Filtering\n> ${
          savedGuild.ticketing.enabled
            ? config.emojis.unicode.on
            : config.emojis.unicode.off
        } Ticketing`
      )
      .setColor(Colors.Blurple);

    try {
      setTimeout(async () => {
        await configMessage.edit({
          embeds: [embed],
          components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .setPlaceholder("Configure Modules:")
                .setCustomId("config")
                .addOptions([
                  new StringSelectMenuOptionBuilder()
                    .setLabel("general")
                    .setValue("general")
                    .setDescription(
                      "This module contains general stuff like prefix, etc."
                    )
                    .setEmoji(
                      savedGuild.general.enabled
                        ? config.emojis.id.on
                        : config.emojis.id.off
                    ),
                  new StringSelectMenuOptionBuilder()
                    .setLabel("Logging Module")
                    .setValue("logging")
                    .setDescription(
                      "Do you want to log when a Member joins? or Leaves? this is the right module!"
                    )
                    .setEmoji(
                      savedGuild.logging.enabled
                        ? config.emojis.id.on
                        : config.emojis.id.off
                    ),
                  new StringSelectMenuOptionBuilder()
                    .setLabel("Ticketing Module")
                    .setValue("ticketing")
                    .setEmoji(
                      savedGuild.ticketing.enabled
                        ? config.emojis.id.on
                        : config.emojis.id.off
                    ),
                  new StringSelectMenuOptionBuilder()
                    .setLabel("Content Filtering")
                    .setValue("contentFiltering")
                    .setEmoji(
                      savedGuild.contentFiltering.enabled
                        ? config.emojis.id.on
                        : config.emojis.id.off
                    ),
                  new StringSelectMenuOptionBuilder()
                    .setLabel("Shields Module")
                    .setDescription(
                      `Use the Shields module to protect your server from rule-breakers!`
                    )
                    .setValue("shields")
                    .setEmoji(
                      savedGuild.shields.enabled
                        ? config.emojis.id.on
                        : config.emojis.id.off
                    ),
                ])
            ),
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("Export Data")
                .setEmoji(config.emojis.id.files)
                .setCustomId("export_guild_data")
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setLabel("Exit Menu")
                .setEmoji("⚠️")
                .setCustomId("exit")
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
        });
      }, 3000);
    } catch (err) {
      Log.fail(err, "commands");
    }
  };
})();
