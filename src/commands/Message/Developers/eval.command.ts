import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  codeBlock,
  Message,
  MessageComponentInteraction,
} from 'discord.js';
import { inspect } from 'util';
import config from '../../../utils/Config';
import Log from '../../../utils/Log';
import Command, { MessageCommandData } from '../../Command';

export default new (class EvalCommand implements Command {
  data: MessageCommandData = {
    name: 'eval',
    summary: 'Evaluate some code',
    permissions: [],
    cooldown: 5000,
  };

  invoke = async (client: Client, message: Message, args: any) => {
    await message.channel.sendTyping();
    if (message.author.id === '622903645268344835') {
      var code = args;
      if (!code)
        return await message.reply({
          content: `> ${config.emojis.unicode.wrong} You need to provide me with some code first!`,
        });
      code = args.join(' ');

      try {
        let output = await eval(code);
        const codeType = typeof output;
        if (typeof output !== 'string') {
          output = inspect(output);
        }

        await message.reply({
          content: `> ${
            config.emojis.unicode.correct
          } Successfully evaluated code!\n\`${codeType}\`\n\n${codeBlock(
            'js',
            output
          )}`,
        });
      } catch (error: any) {
        await message.channel.send(
          `> <a:Alert:936155561878245397> An Error was detected\n${codeBlock(
            error.message ?? 'Unknown Error'
          )}`
        );
        Log.fail(error.stack, 'commands');
      }
    }
  };
})();
