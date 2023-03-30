import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ComponentType,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { GuildSettings } from "../../../database/models/GuildSetting";
import config from "../../../utils/Config";
import Log from "../../../utils/Log";
import SlashCommand from "../../SlashCommand";

export default new (class ConfigCommand implements SlashCommand {
  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("config")
    .setDescription("Indoor your server's journey...")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .setNSFW(false);

  invoke = async (client: Client, interaction: ChatInputCommandInteraction) => {
    const savedGuild = await GuildSettings.findOne({
      _id: interaction.guildId,
    });

    if (!savedGuild)
      return await interaction.followUp({
        content: `${config.emojis.unicode.wrong} Failed to load guild settings: Guild is not registered, please use ${config.emojis.unicode.slashCommand} \`/register\``,
        embeds: [],
        ephemeral: true,
      });

    const components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Save Data")
          .setEmoji(config.emojis.id.edit)
          .setCustomId("save_guild_data")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("Export Data")
          .setEmoji(config.emojis.id.files)
          .setCustomId("export_guild_data")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("Exit Menu")
          .setEmoji(config.emojis.id.warning)
          .setCustomId("exit")
          .setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("config")
          .setPlaceholder(`Select something you want to configure below`)
          .addOptions([
            new StringSelectMenuOptionBuilder()
              .setLabel(`Prefix`)
              .setValue("prefix")
              .setDescription("Edit the guilds prefix")
              .setEmoji(config.emojis.id.generalinfo)
              .setDefault(true),
            new StringSelectMenuOptionBuilder()
              .setLabel(`Hold Role`)
              .setValue("holdRole")
              .setEmoji(config.emojis.id.spark)
              .setDescription("Edit the guilds hold role (security")
              .setDefault(false),
          ])
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel(`Previous`)
          .setDisabled(false)
          .setCustomId("previous")
          .setEmoji(config.emojis.id.leftarrow),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel(`Next`)
          .setDisabled(false)
          .setCustomId("next")
          .setEmoji(config.emojis.id.rightarrow)
      ),
    ];

    const tips = [
      `In-order to edit a module use the buttons "Next" and "Previous" to scroll through pages and use the select menus binded to them.`,
      `Enable the Shields module to ensure that rule-breakers are kept out.`,
      `You can join the beta-testers to get early-access to our new updates by going to our Onboarding channel in our support server.`,
      `Make sure to review your Ticketing module settings to ensure that your support team can effectively manage tickets.`,
      `The Logging module is essential for monitoring user activity and ensuring the safety of your server.`,
      `Customize your Shields module settings to meet the specific needs of your server.`,
      `Regularly review and update your server's configuration to ensure that it remains secure and functional.`,
    ];
    const message = await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setThumbnail(
            "https://cdn.discordapp.com/emojis/859388128040976384.webp?size=240&quality=lossless"
          )
          .setTitle(`Loading settings...`)
          .setDescription(
            `> Please be patient while I get the settings... ${config.emojis.unicode.shine}`
          )
          .setColor(Colors.Blurple)
          .setFooter({
            text: `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`,
            iconURL: await interaction.user.displayAvatarURL({
              forceStatic: false,
            }),
          }),
      ],
      ephemeral: false,
    });

    var embeds: EmbedBuilder[] = [
      new EmbedBuilder()
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/866599434098835486.webp?size=96&quality=lossless"
        )
        .setTitle(`General Module Settings`)
        .setDescription(
          `> ***START EDITING THE GENERAL MODULE BY SELECTING SOMETHING BELOW*** ${
            config.emojis.unicode.shine
          }\n\n> ${
            savedGuild.general.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Toggle\n> ${config.emojis.unicode.generalinfo} \`${
            savedGuild.general.prefix
          }\` Prefix\n> ${config.emojis.unicode.shine} \`${
            interaction.guild?.roles.cache.get(
              savedGuild.general.holdRoleId as string
            ) || "None"
          }\` Hold Role (Security)`
        )
        .setColor(Colors.Blurple)
        .setFooter({
          text: `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`,
          iconURL: await interaction.user.displayAvatarURL({
            forceStatic: false,
          }),
        })
        .setTimestamp(new Date()),
      new EmbedBuilder()
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1090144515580510291.webp?size=240&quality=lossless"
        )
        .setTitle(`Logging Module Settings`)

        .setDescription(
          `> ***START EDITING THE LOGGING MODULE BY SELECTING SOMETHING BELOW*** ${
            config.emojis.unicode.shine
          }\n\n> ${config.emojis.unicode.textChannel} ${
            interaction.guild?.channels.cache.get(savedGuild.logging.channel)
              ?.name || "No Logging Channel"
          }\n> ${
            savedGuild.logging.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Toggle\n> ${
            savedGuild.logging.memberRiskLogging.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Member Risk Logging\n> ${
            savedGuild.logging.welcoming.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Welcoming\n> ${
            savedGuild.logging.leaving.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Leaving`
        )
        .setColor(Colors.Blurple)
        .setFooter({
          text: `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`,
          iconURL: await interaction.user.displayAvatarURL({
            forceStatic: false,
          }),
        })
        .setTimestamp(new Date()),
      new EmbedBuilder()
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/860133545884123136.webp?size=240&quality=lossless"
        )
        .setTitle(`Shields Module Settings`)
        .setDescription(
          `> ***START EDITING THE SHIELDS MODULE BY SELECTING SOMETHING BELOW*** ${
            config.emojis.unicode.shine
          }\n\n> ${config.emojis.unicode.textChannel} ${
            interaction.guild?.channels.cache.get(savedGuild.shields.channel)
              ?.name || "No Logging Channel"
          }\n> ${
            savedGuild.shields.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Toggle\n> ${
            savedGuild.shields.raidShield.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Raid Protection\n> ${
            savedGuild.shields.spamShield.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Spam Protection`
        )
        .setColor(Colors.Blurple)
        .setFooter({
          text: `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`,
          iconURL: await interaction.user.displayAvatarURL({
            forceStatic: false,
          }),
        })
        .setTimestamp(new Date()),
      new EmbedBuilder()
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/860123644545204234.webp?size=240&quality=lossless"
        )
        .setTitle("Content Filtering Settings")
        .setDescription(
          `> ***START EDITING THE CONTENT FILTERING MODULE BY SELECTING SOMETHING BELOW*** ${
            config.emojis.unicode.shine
          }\n\n> ${config.emojis.unicode.textChannel} ${
            interaction.guild?.channels.cache.get(
              savedGuild.contentFiltering.channel
            )?.name || "No Logging Channel"
          }\n> ${
            savedGuild.contentFiltering.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Toggle\n> ${
            savedGuild.contentFiltering.nicknameFiltering.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Nickname Filtering Filtering\n> ${
            savedGuild.contentFiltering.messageFiltering.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Message Filtering`
        )
        .setColor(Colors.Blurple)
        .setFooter({
          text: `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`,
          iconURL: await interaction.user.displayAvatarURL({
            forceStatic: false,
          }),
        })
        .setTimestamp(new Date()),
      new EmbedBuilder()
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/860123644545204234.webp?size=240&quality=lossless"
        )
        .setTitle("Ticketing Settings")
        .setDescription(
          `> ***START EDITING THE TICKETING MODULE BY SELECTING SOMETHING BELOW*** ${
            config.emojis.unicode.shine
          }\n\n> ${
            savedGuild.ticketing.enabled
              ? config.emojis.unicode.on
              : config.emojis.unicode.off
          } Toggle\n> ${config.emojis.unicode.textChannel} ${
            interaction.guild?.channels.cache.get(
              savedGuild.ticketing.transcriptChannel
            )?.name || "No Transcript Channel"
          }\n> ${config.emojis.unicode.support} \`${
            savedGuild.ticketing.supportRoles.length
          }\` Support Roles\n> ${config.emojis.unicode.generalinfo} \`${
            savedGuild.ticketing?.tickets.size || 0
          }\` Active Tickets`
        )
        .setColor(Colors.Blurple)
        .setFooter({
          text: `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`,
          iconURL: await interaction.user.displayAvatarURL({
            forceStatic: false,
          }),
        })
        .setTimestamp(new Date()),
    ];

    var pages = embeds.length;
    let currentPage = 0;

    let index: number = 0;
    if (pages === 1) {
      await interaction.followUp({
        embeds: [embeds[0]],
      });
      return;
    }

    const filter = (i: any) =>
      i.customId === "previous" ||
      i.customId === "next" ||
      i.customId === "export_guild_data" ||
      i.customId === "save_guild_data";

    const collector = message.createMessageComponentCollector({
      filter,
      time: 120000,
    });

    try {
      setTimeout(async () => {
        await message.edit({
          embeds: [embeds[0]],
          components,
        });
      }, 3000);

      collector.on("collect", async (i) => {
        if (i.customId === "previous") {
          if (index === 0) return;
          index--;
          await i.update({
            embeds: [embeds[index]],
            components,
          });
        } else if (i.customId === "next") {
          if (index === embeds.length - 1) return;
          index++;
          await i.update({
            embeds: [embeds[index]],
            components,
          });
        } else if (i.customId === "export_guild_data") {
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
        } else if (i.customId == "save_guild_data") {
          await savedGuild.save()?.catch(() => {});
          await interaction.followUp({
            content: `${config.emojis.unicode.correct} Successfully saved your data.`,
            ephemeral: true,
          });
        }
      });

      collector.on("end", async () => {
        await message.edit({ components: [] });
      });
    } catch (err) {
      Log.fail(err, "commands");
    }
  };
})();
