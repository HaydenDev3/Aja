import { Client, ClientEvents, Message } from "discord.js";
import MessageCommandService from "../../commands/Commands.service";
import { GuildSettings } from "../../database/models/GuildSetting";
import Deps from "../../utils/Deps";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";
import MessageFiltering from "../modules/MessageFiltering.Shield";

export default new (class MessageCreateHandler implements IEvent {
  on: keyof ClientEvents = "messageUpdate";
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

  invoke = async (oldMessage: Message, newMessage: Message) => {
    try {
      if (!newMessage.author || newMessage.author.bot) return;

      const savedGuild =
        (await GuildSettings.findOne({ _id: newMessage.guild?.id })) ||
        new GuildSettings({ _id: newMessage.guild?.id });

      if (oldMessage.content === newMessage.content) return;
      const isCommand = () =>
        newMessage.content.startsWith(savedGuild.general.prefix || "!");

      if (isCommand()) {
        const args = newMessage.content
          .slice(savedGuild.general.prefix.length || 1)
          .trim()
          .split(/ + /g);
        const cmd = args.shift()!.toLowerCase();
        let command = this.commands.commands.get(
          cmd || (this.commands.aliases.get(cmd) as string)
        );
        if (!command) return;
        const slicedContent = newMessage?.content.slice(
          savedGuild.general.prefix.length || 1
        );

        await command.invoke(
          this.client,
          newMessage,
          ...this.commands.getCommandArgs(slicedContent)
        );
        Log.command(command, newMessage.author);
      } else {
        await this.messageFiltering.init(newMessage);
      }
    } catch (err: any) {
      Log.fail(err.message, "commands");
    }
  };
})();
