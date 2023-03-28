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
    eventName: string,
    params: any
  ) => {
    await message.channel.sendTyping();
    if (!eventName) {
      await message.reply(
        `> <:icons_Wrong:1043319853039222916> You need to provide an **Event Name** to execute!`
      );
      return;
    }
    if (!params.length) {
      await message.reply(
        `> <:icons_Wrong:1043319853039222916> You need to provide some **Params** to execute \`${eventName}\`!`
      );
      return;
    }

    if (!config.discord.ownerIds.includes(message.author.id)) return;
    try {
      client.emit(eventName, ...(await eval(params)));
      let sortedParams = Object.keys(params)
        .sort()
        .map((key) => `\`${key}\``)
        .join(", ");
      message.channel.send(
        `<a:success:878493950154002452> Successfully emitted event \`${eventName}\` with params ${sortedParams}`
      );
    } catch (error: any) {
      await message.channel.send(
        `> <a:Alert:936155561878245397> An Error was detected\n${codeBlock(
          error.message ?? "Unknown Error"
        )}`
      );
      Log.fail(error.stack, "commands");
    }
  };
})();
