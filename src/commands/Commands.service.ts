import RegisteringService from '../services/registering.service';
import fs from 'fs';
import Log from '../utils/Log';
import { Message } from 'discord.js';
import { GuildSettings } from '../database/models/GuildSetting';

export default class MessageCommandService extends RegisteringService {
  constructor() {
    super();
    return this;
  }

  public async init() {
    fs.readdirSync(`${__dirname}/Message/`).forEach(async (dir) => {
      const commandFiles = fs
        .readdirSync(`${__dirname}/Message/${dir}/`)
        .filter((file) => file.endsWith('.ts'));

      for (const file of commandFiles) {
        const command = await this.importFile(
          `${__dirname}/Message/${dir}/${file}`
        );
        if (!command) continue;

        this.commands.set(command.data?.name, command);

        if (command.data?.aliases)
          command.data?.aliases.forEach((alias: string) =>
            this.aliases.set(alias, command.data.name)
          );
      }
    });
  }

  public getCommandArgs(slicedContent: string) {
    return slicedContent.split(' ').slice(1);
  }
}
