import RegisteringService from '../services/registering.service';
import fs from 'fs';
import SlashCommand from './SlashCommand';
import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Routes,
} from 'discord.js';
import Log from '../utils/Log';
import { GuildSettings } from '../database/models/GuildSetting';
import { sync } from 'glob';

export default class SlashCommandService extends RegisteringService {
  public readonly appCmds: SlashCommand[] = [];

  constructor() {
    super();
    return this;
  }

  public async init() {
    const slashCommandFiles = sync(`${__dirname}/Slash/**/*.ts`);

    for (const file of slashCommandFiles) {
      const command = await this.importFile(file);
      if (!command || !command?.data) return;

      this.slashCommands.set(command.data?.name, command);
      this.appCmds.push(command.data);
    }
  }
}
