import { Client, ClientEvents, Message } from "discord.js";
import MessageCommandService from "../../commands/Commands.service";
import { GuildSettings } from "../../database/models/GuildSetting";
import Deps from "../../utils/Deps";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";
import MessageFiltering from "../modules/MessageFiltering.Shield";

export default new (class MessageCreateHandler implements IEvent {
  on: keyof ClientEvents = "messageCreate";
  type: EventType = 2;

  constructor(
    private commands: MessageCommandService = Deps.get<MessageCommandService>(
      MessageCommandService
    ),
    private client: Client = Deps.get<Client>(Client),
    private messageFiltering: MessageFiltering = Deps.get<MessageFiltering>(
      MessageFiltering
    )
  ) {}

  invoke = async (message: Message) => {
    try {
      if (message.author.bot || !message?.guild) return;

      const savedGuild =
        (await GuildSettings.findOne({ _id: message.guild.id })) ||
        new GuildSettings({ _id: message.guild.id });

      const isCommand = () =>
        message.content.startsWith(savedGuild.general.prefix || "!");

      if (isCommand()) {
        const args = message.content
          .slice(savedGuild.general.prefix.length || 1)
          .trim()
          .split(/ + /g);
        const cmd = args.shift()!.toLowerCase();
        let command = this.commands.commands.get(
          cmd || (this.commands.aliases.get(cmd) as string)
        );
        if (!command) return;
        const slicedContent = message.content.slice(
          savedGuild.general.prefix.length || 1
        );

        await command.invoke(
          this.client,
          message,
          ...this.commands.getCommandArgs(slicedContent)
        );
        Log.command(command, message.author);
      } else {
        await this.messageFiltering.init(message);
      }
    } catch (err: any) {
      Log.fail(err.message, "commands");
    }
  };
})();
