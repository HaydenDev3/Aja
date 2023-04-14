import {
  WebhookClient,
  Client,
  Message,
  TextChannel,
  APIEmbed,
  codeBlock,
  User,
  Colors,
  Guild,
  ButtonStyle,
} from 'discord.js';
import Command from '../commands/Command';
import SlashCommand from '../commands/SlashCommand';
import config from '../utils/Config';
import Deps from '../utils/Deps';
import Log from '../utils/Log';
import RegisteringService from './registering.service';

export default class WebhookLoggerService extends RegisteringService {
  public async command(
    command: any,
    author: User,
    isSlashCommand: boolean = false
  ) {
    try {
      const channel = this.client.channels.cache.get(
        '1096316197609410573'
      ) as TextChannel;
      const webhook =
        (await channel.fetchWebhooks()).find(
          (x) => x.name === 'Aja - Command Logs'
        ) ??
        (await channel.createWebhook({
          name: 'Aja - Command Logs',
          avatar: this.client.user?.displayAvatarURL({ forceStatic: true }),
        }));

      webhook.send({
        embeds: [
          {
            author: {
              name: author.username,
              icon_url: author.displayAvatarURL({ forceStatic: true }),
            },
            title: `Command Recieved`,
            description: `${
              isSlashCommand ? config.emojis.unicode.slashCommand : ''
            } ${codeBlock(
              `${command.data.name}\nDescription: ${
                command.data.description || 'None, May be a context command'
              }`
            )}`,
            color: Colors.Blurple,
          } as APIEmbed,
        ],
      });
    } catch (err: any) {
      Log.fail(err.stack, 'webhook-logger-service');
    }
  }

  public async feedback(message: string, author: User) {
    try {
      const channel = this.client.channels.cache.get(
        config.discord.feedbackChannelId
      ) as TextChannel;
      const webhook =
        (await channel.fetchWebhooks()).find(
          (x) => x.name === 'Aja - Feedback Logs'
        ) ??
        (await channel.createWebhook({
          name: 'Aja - Feedback Logs',
          avatar: this.client.user?.displayAvatarURL({ forceStatic: true }),
        }));

      webhook.send({
        embeds: [
          {
            author: {
              name: author.username,
              icon_url: author.displayAvatarURL({ forceStatic: true }),
            },
            title: `Feedback Recieved`,
            description: codeBlock(message),
            color: Colors.Blurple,
          } as APIEmbed,
        ],
      });
    } catch (err: any) {
      Log.fail(err.stack, 'webhook-logger-service');
    }
  }
}
