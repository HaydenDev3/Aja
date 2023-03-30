import { ButtonStyle, Client, Message, PermissionFlagsBits } from "discord.js";
import { GuildSettings } from "../../../database/models/GuildSetting";
import config from "../../../utils/Config";
import Command, { MessageCommandData } from "../../Command";

export default new (class HelpCommand implements Command {
  data: MessageCommandData = {
    name: "prefix",
    summary:
      "This command allows the server manager to set a custom prefix for the bot's commands within a Discord server, providing flexibility and customization options for the server's users..",
    permissions: ["ManageGuild"],
  };

  invoke = async (client: Client, message: Message) => {
    await message.channel.sendTyping().catch(() => {});

    const savedGuild = await GuildSettings.findOne({ _id: message.guild?.id });
    if (!savedGuild)
      return await message.reply(
        `> ${config.emojis.unicode.wrong} This server isn't **registered** inside our **databases**, please use ${config.emojis.unicode.slashCommand} \`/register\` command in-order to start your Journey.`
      );
    let prefix = savedGuild.general.prefix;
    if (!prefix) {
      return message.reply(
        `> ${config.emojis.unicode.reply} The current prefix for this server is \`${savedGuild.general.prefix}\``
      );
    }

    if (prefix.length > 10) {
      return message.reply(
        `> ${config.emojis.unicode.wrong} The prefix can't be longer than 10 characters.`
      );
    }

    savedGuild.general.prefix = prefix;
    await savedGuild.save();

    await message.reply(
      `> ${config.emojis.unicode.correct} The prefix for this server has been set to \`${prefix}\`.`
    );
  };
})();
