import { Colors, EmbedBuilder, Message } from "discord.js";
import { GuildSettings } from "../../database/models/GuildSetting";
import { InfractionModel } from "../../database/models/Infraction";
import RegisteringService from "../registering.service";

export default class MessageFiltering extends RegisteringService {
  constructor() {
    super();
  }

  public async init(message: Message) {
    if (message.author.bot || message.guild === null) return;
    const savedGuild = await GuildSettings.findOne({ _id: message.guild.id });
    if (!savedGuild?.contentFiltering.messageFiltering.enabled || !savedGuild)
      return;

    const messageFiltering = await savedGuild.contentFiltering.messageFiltering;
    const isFiltered = () =>
      messageFiltering.bannedWords.includes(message.cleanContent) ||
      messageFiltering.bannedLinks.includes(message.cleanContent);

    const action = messageFiltering.action;
    if (isFiltered()) {
      if (action === "ban") {
        await message.member?.ban({ reason: "Banned for Auto Moderation" });
        await message.member?.send({
          content: messageFiltering.banMessage,
        });
      } else if (action === "warn") {
        await message.delete().catch(() => {});
        const msg = await message.reply({
          content: messageFiltering.warningMessage,
        });

        const newData = await InfractionModel.create({
          _id: message.guild.id,
          memberId: message.member?.id,
          reason: "Warned for Auto Moderation",
          date: new Date(),
        });
        await newData.save();

        setTimeout(async () => {
          await msg.delete().catch(() => {});
        }, 5000);
      } else if (action == "kick") {
        await message.member?.kick("Banned for Auto Moderation");
        await message.member?.send({
          content: messageFiltering.kickMessage,
        });
      }
    }
  }
}
