import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Colors,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
  Snowflake,
} from "discord.js";
import { GuildSettings } from "../../../database/models/GuildSetting";
import config from "../../../utils/Config";
import Command, { MessageCommandData } from "../../Command";
import SlashCommand from "../../SlashCommand";

export default new (class HelpCommand implements SlashCommand {
  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("register")
    .setDescription(
      "Register your server into our databases to indoor your servers security."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

  invoke = async (client: Client, interaction: ChatInputCommandInteraction) => {
    const guildId = interaction.guildId as Snowflake;
    const savedGuild = await GuildSettings.findOne({ guildId });
    if (savedGuild) {
      return await interaction.followUp({
        content: `> ${config.emojis.unicode.correct} This server is already **registered**.`,
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder({
      title: "Confirm Server Registration",
      description: `Are you sure you want to register **${interaction.guild?.name}**?`,
      color: Colors.Blurple,
    });

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder({
        customId: "register_yes",
        label: "Yes",
        style: ButtonStyle.Success,
        emoji: config.emojis.id.correct,
      }),
      new ButtonBuilder({
        customId: "register_no",
        label: "No",
        style: ButtonStyle.Danger,
        emoji: config.emojis.id.wrong,
      })
    );

    const message = await interaction.followUp({
      embeds: [embed],
      components: [buttonRow as any],
      fetchReply: true,
      ephemeral: true,
    });

    const filter = (i: any) =>
      i.customId === "register_yes" || i.customId === "register_no";
    const collector = await message.createMessageComponentCollector({
      filter,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "register_yes") {
        if (savedGuild) {
          await message.edit({
            content: `> ${config.emojis.unicode.wrong} **${message.guild?.name}** already exists within the *database**.`,
            embeds: [],
            components: [],
          });
        } else if (!savedGuild) {
          await GuildSettings.create({ _id: guildId });
          await message.edit({
            content: `> ${config.emojis.unicode.correct} **${message.guild?.name}** has been enrolled.`,
            embeds: [],
            components: [],
          });
        }
      } else {
        await i.update({
          content: `❌ Registration cancelled.`,
          embeds: [],
          components: [],
        });
      }
    });

    collector.on("end", async () => {
      if (!(await message)) {
        await message.edit({
          components: [],
        });
      }
    });
  };
})();
