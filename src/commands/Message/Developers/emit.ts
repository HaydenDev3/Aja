import { Client, codeBlock, Message } from "discord.js";
import config from "../../../utils/Config";
import Log from "../../../utils/Log";
import Command, { MessageCommandData } from "../../Command";

export default new (class EmitCommand implements Command {
  data: MessageCommandData = {
    name: "emit",
    summary:
      "Emit a custom event with specified parameters to trigger custom functionality.",
    permissions: [],
    cooldown: 5000,
  };

  invoke = async (
    client: Client,
    message: Message,
  ) => {
    await message.channel.sendTyping();

    if (!config.discord.ownerIds.includes(message.author.id)) return;
    try {
      if ( !message.guild ) return;
      client.emit('guildCreate', message.guild);
      message.channel.send(
        `> ${config.emojis.unicode.correct} Successfully emitted event \`Guild Create\``
      );
    } catch (error: any) {
      Log.fail(error.stack, "commands");
      await message.channel.send(
        `> <a:Alert:936155561878245397> An Error was detected\n${codeBlock(
          error.message ?? "Unknown Error"
        )}`
      );
    }
  };
})();
