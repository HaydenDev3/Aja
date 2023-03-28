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
const GuildSetting_1 = require("../../database/models/GuildSetting");
const registering_service_1 = __importDefault(
  require("../registering.service")
);
class TicketingService extends registering_service_1.default {
  constructor() {
    super();
    this.client.on("messageCreate", this.handleMessage.bind(this));
  }
  handleMessage(message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (message.author.bot || !message.guild || !message) return;
      const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
        _id: message.guild.id,
      });
      if (
        !savedGuild ||
        !((_a = savedGuild.ticketing) === null || _a === void 0
          ? void 0
          : _a.enabled)
      )
        return;
      if (message.channel.type === discord_js_1.ChannelType.DM) {
        const ticket = savedGuild.ticketing.tickets.get(message.author.id);
        if (ticket && ticket.open) {
          // This is a reply to an existing ticket
          const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0000ff")
            .setTitle(`Reply from ${message.author.tag}`)
            .setDescription(message.content)
            .setTimestamp();
          yield ticket.channel.send({ embeds: [embed] });
        } else {
          // This is a new ticket
          const { guild } = message;
          const channel = yield guild === null || guild === void 0
            ? void 0
            : guild.channels.create({
                name: `${message.author.username}-ticket`,
                type: discord_js_1.ChannelType.GuildText,
                topic: `Ticket opened by ${message.author.tag}`,
                permissionOverwrites: [
                  {
                    id: guild.roles.everyone,
                    deny: [discord_js_1.PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: message.author.id,
                    allow: [
                      discord_js_1.PermissionFlagsBits.ViewChannel,
                      discord_js_1.PermissionFlagsBits.SendMessages,
                      discord_js_1.PermissionFlagsBits.AttachFiles,
                    ],
                  },
                ],
              });
          for (const staffRole of savedGuild.ticketing.supportRoles) {
            yield channel.permissionOverwrites.edit(staffRole.id, {
              ViewChannel: true,
              SendMessages: true,
              AttachFiles: true,
              UseApplicationCommands: true,
            });
          }
          const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0000ff")
            .setTitle(`New ticket from ${message.author.tag}`)
            .setDescription(message.content)
            .setTimestamp();
          const closeButton = new discord_js_1.ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("Close Ticket")
            .setStyle(discord_js_1.ButtonStyle.Danger);
          const row = new discord_js_1.ActionRowBuilder().addComponents(
            closeButton
          );
          const msg = yield channel.send({
            content: `<@${
              message === null || message === void 0
                ? void 0
                : message.author.id
            }>`,
            embeds: [embed],
            components: [row],
          });
          savedGuild.ticketing.tickets.set(msg.author.id, {
            guild,
            channel,
            author: message.member,
            open: true,
          });
          const collector = yield message.createMessageComponentCollector({
            filter: (interaction) =>
              interaction.customId == "close-ticket" &&
              interaction.user.id === message.author.id,
            time: 60000, // 1 minute
          });
          collector.on("collect", (interaction) =>
            __awaiter(this, void 0, void 0, function* () {
              collector.stop();
              yield interaction.deferUpdate();
              yield this.closeTicket(message.member, savedGuild);
            })
          );
          collector.on("end", () =>
            __awaiter(this, void 0, void 0, function* () {
              if (!message) return;
              const closeButton = new discord_js_1.ButtonBuilder()
                .setCustomId("close-ticket")
                .setLabel("Close Ticket")
                .setStyle(discord_js_1.ButtonStyle.Danger)
                .setDisabled(true);
              const row = new discord_js_1.ActionRowBuilder().addComponents(
                closeButton
              );
              yield message.edit({ components: [row] });
            })
          );
        }
      } else if (
        message.channel.type === discord_js_1.ChannelType.GuildText &&
        ((_b = message.member) === null || _b === void 0
          ? void 0
          : _b.roles.cache.has("<staff-role-id>"))
      ) {
        const ticket = this.getTicketFromChannel(message.channel, savedGuild);
        if (ticket) {
          const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0000ff")
            .setTitle(`Reply from ${message.author.tag}`)
            .setDescription(message.content)
            .setTimestamp();
          yield ticket.author.send({ embeds: [embed] });
        } else {
          // Ticket is closed, send error message to staff member
          const embed = new discord_js_1.EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("Error")
            .setDescription("This ticket is closed.")
            .setTimestamp();
          yield message.reply({ embeds: [embed] });
        }
      }
    });
  }
  getTicketFromChannel(channel, savedGuild) {
    for (const ticket of savedGuild.ticketing.tickets.values()) {
      if (ticket.channel.id === channel.id) {
        return ticket;
      }
    }
    return undefined;
  }
  closeTicket(member, savedGuild) {
    return __awaiter(this, void 0, void 0, function* () {
      const ticket = savedGuild.ticketing.tickets.get(member.id);
      if (ticket) {
        yield ticket.channel.delete();
        savedGuild.ticketing.tickets.delete(member.id);
        const embed = new discord_js_1.EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("Ticket Closed")
          .setDescription(
            `The ticket opened by ${member.user.tag} has been closed.`
          )
          .setTimestamp();
        yield ticket.author.send({ embeds: [embed] });
      }
    });
  }
}
exports.default = TicketingService;
