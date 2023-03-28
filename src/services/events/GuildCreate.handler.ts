import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  ClientEvents,
  Colors,
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
      if ( !guild ) return;

      const embed = new EmbedBuilder()
        .setTitle(`New Guild: ${guild.name}`)
        .setColor(Colors.Green)
        .setDescription(
          `I've been added to a new guild: ${guild.name} (${guild.id}).`
        )
        .addFields([
          {
            name: "Owner",
            value: `> ${config.emojis.unicode.person} ${guild.members.cache.get(guild.ownerId)?.user.tag}` || "Unknown",
            inline: true,
          },
          { 
            name: "Members", 
            value: `> ${config.emojis.unicode.person} ${guild.memberCount}`, 
            inline: true 
          },
          {
            name: "Created At",
            value: `${guild.createdAt.toLocaleDateString()}`,
            inline: true,
          },
          {
            name: "Verification Level",
            value: `> ${config.emojis.unicode.vip} ${guild.verificationLevel.toString().toUpperCase()}`,
            inline: true,
          },
          { 
            name: "Roles", 
            value: `> ${config.emojis.unicode.vip} ${guild.roles.cache.size}`, 
            inline: true 
          },
          { 
            name: "Channels", 
            value: `> ${config.emojis.unicode.textChannel} ${guild.channels.cache.size}`, 
            inline: true 
          },
        ]);
        
      const ch = (this.client.channels.cache.get(
        process.env.GUILD_LOGS as string
      )) as TextChannel;
      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("leave_guild")
          .setLabel("Leave Guild")
          .setEmoji(config.emojis.id.wrong)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("delete_guild_data")
          .setLabel("Delete Guild Data")
          .setEmoji(config.emojis.id.wrong)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("create_guild_data")
          .setLabel("Create Guild Data")
          .setEmoji(config.emojis.id.correct)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("export_guild_data")
          .setLabel("Export Guild Data")
          .setEmoji(config.emojis.id.files)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("exit")
          .setLabel("Exit Menu")
          .setEmoji(config.emojis.id.wrong)
          .setStyle(ButtonStyle.Primary),
      );

      const message = await ch?.send({
        embeds: [embed],
        components: [actionRow],
      });

      const filter = (interaction: any) =>
        config.discord.ownerIds.includes(interaction.user.id);
      const collector = message?.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (interaction: ButtonInteraction) => {
        let savedGuild = await GuildSettings.findOne({ _id: guild.id });

        if (interaction.customId === "leave_guild") {
          await guild.leave();
          await interaction.followUp("Left the guild.");
        } else if (interaction.customId === "delete_guild_data") {
          if (!savedGuild) {
            await interaction.followUp(`Guild doesn't have any data`);
          } else {
            await GuildSettings.deleteOne({ _id: guild.id });
            await interaction.followUp("Deleted guild data.");
            return;
          }
        } else if (interaction.customId === "create_guild_data") {
          if (!savedGuild) {
            savedGuild = new GuildSettings({ _id: guild.id });
            await savedGuild.save();
          } else savedGuild.toJSON();
          await interaction.followUp({ content: "Created guild data.", ephemeral: true });
        } else if (interaction.customId === "export_guild_data") {
          savedGuild = await GuildSettings.findOne({ _id: guild.id });
          if ( !savedGuild ) {
            await interaction.followUp({
              content: `${config.emojis.unicode.wrong} Failed to load guild settings: Guild is not registered, please use ${config.emojis.unicode.slashCommand} \`/register\``,
              embeds: [],
            });
            return;
          };
          
          const data = savedGuild?.toJSON();
          const jsonData = JSON.stringify(data);

          const attachment = new AttachmentBuilder(Buffer.from(jsonData), {
            name: `${guild.id}.json`,
          });

          await interaction.followUp({
            files: [attachment],
            content: "Here is the guild data.",
          });
        } else if (interaction.customId === "exit") {
          savedGuild = await GuildSettings.findOne({ _id: guild.id });
          if ( !savedGuild ) {
            await interaction.followUp({
              content: `${config.emojis.unicode.wrong} Failed to load guild settings: Guild is not registered, please use ${config.emojis.unicode.slashCommand} \`/register\``,
              embeds: [],
            });
            return;
          };

          await savedGuild.save();
          await message.edit({
            content: `${config.emojis.unicode.correct} Successfully exited the menu & Saved data.`,
            embeds: [],
            components: []
          });
        }
      });

      collector.on("end", async () => {
        await message.edit({ components: [] });
      });
  };
})();
