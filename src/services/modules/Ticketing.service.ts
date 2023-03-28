import {
  Client,
  Guild,
  GuildMember,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
  ChannelType,
  ButtonInteraction,
  PermissionFlagsBits,
  GuildChannel,
} from "discord.js";
import {
  GuildSettings,
  GuildSettingsDocument,
} from "../../database/models/GuildSetting";
import Deps from "../../utils/Deps";
import RegisteringService from "../registering.service";

interface Ticket {
  guild: Guild;
  channel: TextChannel;
  author: GuildMember;
  open: boolean;
}

export default class TicketingService extends RegisteringService {
  constructor() {
    super();
    this.client.on("messageCreate", this.handleMessage.bind(this));
  }

  private async handleMessage(message: Message) {
    if (message.author.bot || !message.guild || !message) return;

    const savedGuild = await GuildSettings.findOne({ _id: message.guild.id });
    if (!savedGuild || !savedGuild.ticketing?.enabled) return;
    if (message.channel.type === ChannelType.DM) {
      const ticket = savedGuild.ticketing.tickets.get(message.author.id);
      if (ticket && ticket.open) {
        // This is a reply to an existing ticket
        const embed = new EmbedBuilder()
          .setColor("#0000ff")
          .setTitle(`Reply from ${message.author.tag}`)
          .setDescription(message.content)
          .setTimestamp();
        await ticket.channel.send({ embeds: [embed] });
      } else {
        // This is a new ticket
        const { guild } = message;
        const channel = (await guild?.channels.create({
          name: `${message.author.username}-ticket`,
          type: ChannelType.GuildText,
          topic: `Ticket opened by ${message.author.tag}`,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: message.author.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.AttachFiles,
              ],
            },
          ],
        })) as TextChannel;
        for (const staffRole of savedGuild.ticketing.supportRoles) {
          await channel.permissionOverwrites.edit(staffRole.id, {
            ViewChannel: true,
            SendMessages: true,
            AttachFiles: true,
            UseApplicationCommands: true,
          });
        }
        const embed = new EmbedBuilder()
          .setColor("#0000ff")
          .setTitle(`New ticket from ${message.author.tag}`)
          .setDescription(message.content)
          .setTimestamp();
        const closeButton = new ButtonBuilder()
          .setCustomId("close-ticket")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(closeButton);
        const msg = await channel.send({
          content: `<@${message?.author.id}>`,
          embeds: [embed],
          components: [row as any],
        });

        savedGuild.ticketing.tickets.set(msg.author.id, {
          guild,
          channel,
          author: message.member as GuildMember,
          open: true,
        });

        const collector = await message.createMessageComponentCollector({
          filter: (interaction: any) =>
            interaction.customId == "close-ticket" &&
            interaction.user.id === message.author.id,
          time: 60000, // 1 minute
        });
        collector.on("collect", async (interaction: ButtonInteraction) => {
          collector.stop();
          await interaction.deferUpdate();
          await this.closeTicket(message.member as GuildMember, savedGuild);
        });
        collector.on("end", async () => {
          if (!message) return;
          const closeButton = new ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);
          const row = new ActionRowBuilder().addComponents(closeButton);
          await message.edit({ components: [row as any] });
        });
      }
    } else if (
      message.channel.type === ChannelType.GuildText &&
      message.member?.roles.cache.has("<staff-role-id>")
    ) {
      const ticket = this.getTicketFromChannel(message.channel, savedGuild);
      if (ticket) {
        const embed = new EmbedBuilder()
          .setColor("#0000ff")
          .setTitle(`Reply from ${message.author.tag}`)
          .setDescription(message.content)
          .setTimestamp();
        await ticket.author.send({ embeds: [embed] });
      } else {
        // Ticket is closed, send error message to staff member
        const embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Error")
          .setDescription("This ticket is closed.")
          .setTimestamp();
        await message.reply({ embeds: [embed] });
      }
    }
  }

  private getTicketFromChannel(
    channel: TextChannel,
    savedGuild: GuildSettingsDocument
  ): Ticket | undefined {
    for (const ticket of savedGuild.ticketing.tickets.values()) {
      if (ticket.channel.id === channel.id) {
        return ticket;
      }
    }
    return undefined;
  }

  private async closeTicket(
    member: GuildMember,
    savedGuild: GuildSettingsDocument
  ): Promise<void> {
    const ticket = savedGuild.ticketing.tickets.get(member.id);
    if (ticket) {
      await ticket.channel.delete();
      savedGuild.ticketing.tickets.delete(member.id);
      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Ticket Closed")
        .setDescription(
          `The ticket opened by ${member.user.tag} has been closed.`
        )
        .setTimestamp();
      await ticket.author.send({ embeds: [embed] });
    }
  }
}
