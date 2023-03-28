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
const moment_1 = __importDefault(require("moment"));
const GuildSetting_1 = require("../../database/models/GuildSetting");
const registering_service_1 = __importDefault(
  require("../registering.service")
);
class MemberClearanceLog extends registering_service_1.default {
  constructor() {
    super();
  }
  init(member) {
    return __awaiter(this, void 0, void 0, function* () {
      const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
        _id: member.guild.id,
      });
      if (savedGuild && !savedGuild.memberClearance.enabled) return;
      let guildConfig =
        savedGuild === null || savedGuild === void 0
          ? void 0
          : savedGuild.memberClearance;
      const guildRoles = member.guild.roles.cache;
      let assignedRole = member.user.bot
        ? guildRoles.get(
            guildConfig === null || guildConfig === void 0
              ? void 0
              : guildConfig.botRole
          )
        : guildRoles.get(
            guildConfig === null || guildConfig === void 0
              ? void 0
              : guildConfig.memberRole
          );
      if (!assignedRole) assignedRole = "None";
      else
        yield member.roles.add(assignedRole).catch(() => {
          assignedRole = "Failed due to role hieraracy";
        });
      const LogChannel = (yield member.guild.channels.fetch()).get(
        guildConfig === null || guildConfig === void 0
          ? void 0
          : guildConfig.logChannel
      );
      if (!LogChannel) return;
      let colour;
      let risk = "Fairly Safe";
      var accountCreation = parseInt(member.user.createdTimestamp / 1000);
      var joiningTime = parseInt(member.joinedAt / 1000);
      var monthsAgo = (0, moment_1.default)().subtract(2, "months").unix();
      var weeksAgo = (0, moment_1.default)().subtract(2, "weeks").unix();
      var daysAgo = (0, moment_1.default)().subtract(2, "days").unix();
      if (accountCreation >= monthsAgo) {
        colour = `${discord_js_1.Colors.Blurple}`;
        risk = "Low <:icons_Correct:1043319634776047667>";
      } else if (accountCreation >= weeksAgo) {
        colour = `${discord_js_1.Colors.Yellow}`;
        risk = "Medium :warn:";
      } else if (accountCreation >= daysAgo) {
        colour = `${discord_js_1.Colors.Red}`;
        risk = "Extreme <a:Alert:936155561878245397>";
      }
      const embed = new discord_js_1.EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag}`,
          url: `https://discord.com/users/${member.id}`,
          iconURL: member.user.displayAvatarURL({ forceStatic: false }),
        })
        .setColor(colour || discord_js_1.Colors.Blurple)
        .setDescription(
          `> <:replycontinue:998771075427094539> ${
            member.user.bot ? "Bot" : "User"
          } Account Type\n> <:replycontinue:998771075427094539> ${risk} Risk Level\n> <:replycontinue:998771075427094539> ${assignedRole} Role Assigned\n> <:replycontinue:998771075427094539> ${(0,
          discord_js_1.time)(
            accountCreation
          )} Account Created\n> <:reply:878577643300204565> ${(0,
          discord_js_1.time)(joiningTime)} Account Joined`
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: "Joined" })
        .setTimestamp();
      if (risk.includes("Extreme") || risk.includes("Medium")) {
        const Buttons = new discord_js_1.ActionRowBuilder().addComponents(
          new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setLabel(`Kick`)
            .setCustomId(`MemberLogging-Kick`),
          new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setLabel(`Ban`)
            .setCustomId(`MemberLogging-Ban`),
          new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setLabel(`Hold`)
            .setCustomId(`MemberLogging-Hold`),
          new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setLabel(`Warn`)
            .setCustomId(`MemberLogging-Warn`)
        );
        return LogChannel.send({ embeds: [embed], components: [Buttons] });
      }
    });
  }
}
exports.default = MemberClearanceLog;
