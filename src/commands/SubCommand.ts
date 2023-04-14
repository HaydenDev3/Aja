import { SlashCommandSubcommandBuilder } from 'discord.js';

export default interface SubCommand {
  data: SlashCommandSubcommandBuilder;
  invoke: (...args: any[]) => Promise<any>;
}
