import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  GuildMember,
  Role,
  TextChannel,
  time,
} from "discord.js";
import moment from "moment";
import { GuildSettings } from "../../database/models/GuildSetting";
import RegisteringService from "../registering.service";

export default class MemberClearanceLog extends RegisteringService {
  constructor() {
    super();
  }

  public async init(member: GuildMember) {
    const savedGuild = await GuildSettings.findOne({ _id: member.guild.id });
    if (savedGuild && !savedGuild.logging.memberRiskLogging.enabled) return;
    let guildConfig = savedGuild?.logging.memberRiskLogging;

    const guildRoles = member.guild.roles.cache;
    let assignedRole: any = member.user.bot
      ? guildRoles.get(guildConfig?.botRole as string)
      : guildRoles.get(guildConfig?.memberRole as string);

    if (!assignedRole) assignedRole = "None";
    else
      await member.roles.add(assignedRole).catch(() => {
        assignedRole = "Failed due to role hieraracy";
      });

    const LogChannel = (await member.guild.channels.fetch()).get(
      savedGuild?.logging.channel as string
    ) as TextChannel;
    if (!LogChannel) return;

    let colour;
    let risk = "Fairly Safe";

    var accountCreation = parseInt(
      (member.user.createdTimestamp / 1000) as any
    );
    var joiningTime = parseInt(((member.joinedAt as any) / 1000) as any);

    var monthsAgo = moment().subtract(2, "months").unix();
    var weeksAgo = moment().subtract(2, "weeks").unix();
    var daysAgo = moment().subtract(2, "days").unix();

    if (accountCreation >= monthsAgo) {
      colour = `${Colors.Blurple}`;
      risk = "Low <:icons_Correct:1043319634776047667>";
    } else if (accountCreation >= weeksAgo) {
      colour = `${Colors.Yellow}`;
      risk = "Medium :warn:";
    } else if (accountCreation >= daysAgo) {
      colour = `${Colors.Red}`;
      risk = "Extreme <a:Alert:936155561878245397>";
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.tag}`,
        url: `https://discord.com/users/${member.id}`,
        iconURL: member.user.displayAvatarURL({ forceStatic: false }),
      })
      .setColor(colour || (Colors.Blurple as any))
      .setDescription(
        `> <:replycontinue:998771075427094539> ${
          member.user.bot ? "Bot" : "User"
        } Account Type\n> <:replycontinue:998771075427094539> ${risk} Risk Level\n> <:replycontinue:998771075427094539> ${assignedRole} Role Assigned\n> <:replycontinue:998771075427094539> ${time(
          accountCreation
        )} Account Created\n> <:reply:878577643300204565> ${time(
          joiningTime
        )} Account Joined`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: "Joined" })
      .setTimestamp();

    if (risk.includes("Extreme") || risk.includes("Medium")) {
      const Buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(`Kick`)
          .setCustomId(`MemberLogging-Kick`),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(`Ban`)
          .setCustomId(`MemberLogging-Ban`),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(`Hold`)
          .setCustomId(`MemberLogging-Hold`),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`Warn`)
          .setCustomId(`MemberLogging-Warn`)
      );

      return LogChannel.send({ embeds: [embed], components: [Buttons as any] });
    }
  }
}
