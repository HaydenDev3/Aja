import { GuildMember } from "discord.js";
import { GuildSettings } from "../../database/models/GuildSetting";
import { InfractionModel } from "../../database/models/Infraction";
import RegisteringService from "../registering.service";

export default class NicknameFiltering extends RegisteringService {
  constructor() {
    super();
  }

  public async init(member: GuildMember) {
    if (member.user.bot || member.nickname === "") return;
    const savedGuild = await GuildSettings.findOne({ _id: member.guild.id });
    if (!savedGuild?.contentFiltering.nicknameFiltering.enabled || !savedGuild)
      return;

    const nicknameFiltering = savedGuild?.contentFiltering.nicknameFiltering;
    const filteredNickname = nicknameFiltering.filtered?.includes(
      member.nickname ?? member.user.username
    );

    if (filteredNickname) {
      for (const action of nicknameFiltering.action) {
        switch (action) {
          case "modify": {
            const id = Math.floor(Math.random() * 10000) + 5000;
            try {
              await member.setNickname(`Moderated Nickname ${id}`);
            } catch (error) {
              console.error(`Failed to modify nickname: ${error}`);
            }
            break;
          }
          case "ban": {
            await member.ban({
              reason: `Auto Moderation for: Nickname Filtering`,
            });
            break;
          }
          case "kick": {
            await member.kick(`Auto Moderation for: Nickname Filtering`);
            break;
          }
          case "warn": {
            const newData = await InfractionModel.create({
              _id: member.guild.id,
              memberId: member?.id,
              reason: "New Infraction for: Nickname Filtering",
              date: new Date(),
            });
            await newData.save();

            await member.send(`You've been warned for: \`${newData.reason}\``);
            break;
          }
          default: {
            console.error(`Invalid action: ${action}`);
          }
        }
      }
    }
  }
}
