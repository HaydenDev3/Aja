import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  ClientEvents,
  EmbedBuilder,
  Guild,
  TextChannel,
} from "discord.js";
import { GuildSettings } from "../../database/models/GuildSetting";
import config from "../../utils/Config";
import Deps from "../../utils/Deps";
import { EventType, IEvent } from "../events.service";

export default new (class GuildCreateHandler implements IEvent {
  on: keyof ClientEvents = "guildCreate";
  type: EventType = 2;

  constructor(private client: Client = Deps.get<Client>(Client)) {}

  invoke = async (guild: Guild) => {
    for (const id of config.discord.ownerIds) {
      let owner = this.client.users.cache.get(id);

      const embed = new EmbedBuilder()
        .setTitle(`New Guild: ${guild.name}`)
        .setColor("#008000")
        .setDescription(
          `I've been added to a new guild: ${guild.name} (${guild.id}).`
        )
        .addFields([
          {
            name: "Owner",
            value:
              guild.members.cache.get(guild.ownerId)?.user.tag || "Unknown",
            inline: true,
          },
          { name: "Members", value: guild.memberCount, inline: true },
          {
            name: "Created At",
            value: guild.createdAt.toLocaleDateString(),
            inline: true,
          },
          {
            name: "Premium Progressed Bar",
            value: guild.premiumProgressBarEnabled as any,
            inline: true,
          },
          {
            name: "Verification Level",
            value: guild.verificationLevel.toString().toUpperCase(),
            inline: true,
          },
          { name: "Roles", value: guild.roles.cache.size, inline: true },
          { name: "Channels", value: guild.channels.cache.size, inline: true },
        ]);
      const ch = (await guild.client.channels.cache.get(
        process.env!.GUILD_LOGS as string
      )) as TextChannel;
      await ch?.send({
        embeds: [embed],
        components: [],
      });

      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("leave_guild")
          .setLabel("Leave Guild")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("delete_guild_data")
          .setLabel("Delete Guild Data")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("create_guild_data")
          .setLabel("Create Guild Data")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("export_guild_data")
          .setLabel("Export Guild Data")
          .setStyle(ButtonStyle.Primary)
      );

      const dmChannel = await owner!.createDM(true);
      const message = await dmChannel?.send({
        embeds: [embed],
        components: [actionRow as any],
      });

      const filter = (interaction: any) =>
        config.discord.ownerIds.includes(interaction.user.id);
      const collector = await dmChannel?.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (interaction: ButtonInteraction) => {
        let savedGuild = await GuildSettings.findOne({ _id: guild.id });

        if (interaction.customId === "leave_guild") {
          await guild.leave();
          await interaction.reply("Left the guild.");
        } else if (interaction.customId === "delete_guild_data") {
          if (!savedGuild) {
            await interaction.reply(`Guild doesn't have any data`);
          } else {
            await GuildSettings.deleteOne({ _id: guild.id });
            await interaction.reply("Deleted guild data.");
            return;
          }
        } else if (interaction.customId === "create_guild_data") {
          if (!savedGuild) {
            savedGuild = new GuildSettings({ _id: guild.id });
            await savedGuild.save();
          } else savedGuild.toJSON();
          interaction.reply("Created guild data.");
        } else if (interaction.customId === "export_guild_data") {
          savedGuild = await GuildSettings.findOne({ guildId: guild.id });
          const data = savedGuild?.toJSON();
          const jsonData = JSON.stringify(data, null, 2);

          const attachment = new AttachmentBuilder(Buffer.from(jsonData), {
            name: `${guild.id}.json`,
          });

          interaction.reply({
            files: [attachment],
            content: "Here is the guild data.",
          });
        }
      });

      collector.on("end", async () => {
        await message.edit({ components: [] });
      });
    }
  };
})();
