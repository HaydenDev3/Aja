import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  Colors,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Routes,
} from "discord.js";
import MessageCommandService from "../../commands/Commands.service";
import SlashCommandService from "../../commands/SlashCommands.service";
import { GuildSettings } from "../../database/models/GuildSetting";
import Deps from "../../utils/Deps";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";

export default new (class InteractionCreateHandler implements IEvent {
  on: keyof ClientEvents = "interactionCreate";
  type: EventType = 2;

  constructor(
    private slashCommandService: SlashCommandService = Deps.get<SlashCommandService>(
      SlashCommandService
    ),
    private client: Client = Deps.get<Client>(Client)
  ) {}

  invoke = async (
    interaction:
      | ChatInputCommandInteraction
      | ContextMenuCommandInteraction
      | ButtonInteraction
  ) => {
    if (interaction.isChatInputCommand()) {
      try {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.deferred)
          await interaction.deferReply({ ephemeral: false }).catch(() => {});

        let savedGuild = await GuildSettings.findOne({
          _id: interaction.guild?.id,
        });

        let command = this.slashCommandService.slashCommands.get(
          interaction.commandName
        );
        if (!command) {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `> <:icons_Wrong:1043319853039222916> ***THIS COMMAND DOES NOT EXIST OR IS STILL LOADING***`
                )
                .setColor(Colors.Red),
            ],
          });
          return;
        }

        await command.invoke(this.client, interaction);
        Log.command(command, interaction.user, true);
      } catch (err: any) {
        Log.fail(err.message, "commands");
      }
    } else if (interaction.isButton()) {
      if (interaction.customId?.toLowerCase() !== "hide_message") return;

      await interaction.message.delete().catch(() => {});
    } else if (interaction.isContextMenuCommand()) {
      let command = this.slashCommandService.slashCommands.get(
        interaction.commandName
      );
      if (!command) return;
      await interaction.deferReply({ ephemeral: true }).catch(() => {});
      await command.invoke(this.client, interaction);
    }
  };
})();

/**
 * @INFO
 * Aja is a security focused Discord bot, with Aja you can ensure that your server is secured with cutting-edge security features.
 * @INFO
 * Developed and Created by Hayden#8982.
 */
