import {
  ButtonStyle,
  Client,
  codeBlock,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { inspect } from "util";
import config from "../../../utils/Config";
import Log from "../../../utils/Log";
import Command, { MessageCommandData } from "../../Command";

export default new (class EvalCommand implements Command {
  data: MessageCommandData = {
    name: "eval",
    summary: "Eval rows/or lines of code.",
    permissions: [],
    cooldown: 5000,
  };

  invoke = async (client: Client, message: Message, code: any) => {
    await message.channel.sendTyping();
    if (!config.discord.ownerIds.includes(message.author.id)) {
      await message.channel.send({
        content: `> <a:Alert:936155561878245397> This is owner only`,
      });
      return;
    }
    if (!code) {
      await message.channel.send({
        content: `> <a:Alert:936155561878245397> You need to specifiy some **code** to evaluate on.`,
      });
      return;
    }

    try {
      const result = await eval(code);
      let output = result;
      if (typeof result !== "string") {
        output = inspect(result);
      }

      await message.channel.send({
        content: `> Eval Response:\n${codeBlock(output)}`,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Hide Message",
                customId: "hide_message",
                disabled: false,
                emoji: "1008179260621590528",
                style: ButtonStyle.Secondary,
              },
            ],
          },
        ],
      });
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
