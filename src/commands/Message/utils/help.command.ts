import { AttachmentBuilder, ButtonStyle, Client, Message } from 'discord.js';
import Command, { MessageCommandData } from '../../Command';
import fs from 'fs';
import config from '../../../utils/Config';
export default new (class HelpCommand implements Command {
  data: MessageCommandData = {
    name: 'help',
    summary: 'Recieve help upon using this command.',
  };

  invoke = async (client: Client, message: Message) => {
    await message.channel.sendTyping().catch(() => {});
    const imageBuffer = fs.readFileSync(`${__dirname}/help_command.png`);
    const image = new AttachmentBuilder(imageBuffer, {
      name: 'help_command.png',
    });

    await message.reply({
      content: `> ${config.emojis.unicode.reply} Hey ${message.author.username}, Kindly use ${config.emojis.unicode.slashCommand} To Indoor Your Journey.`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Hide Message',
              customId: 'hide_message',
              disabled: false,
              emoji: '1008179260621590528',
              style: ButtonStyle.Secondary,
            },
          ],
        },
      ],
      files: [image],
    });
  };
})();
