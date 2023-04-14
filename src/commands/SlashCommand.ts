import {
  ApplicationCommandDataResolvable,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from 'discord.js';

export default interface SlashCommand {
  data:
    | SlashCommandBuilder
    | ContextMenuCommandBuilder
    | ApplicationCommandDataResolvable;
  invoke: (...args: any[]) => Promise<any> | void;
}
