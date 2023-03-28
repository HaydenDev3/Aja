import { ActivityType, Client, ClientEvents, Routes } from "discord.js";
import MessageCommandService from "../../commands/Commands.service";
import SlashCommandService from "../../commands/SlashCommands.service";
import config from "../../utils/Config";
import Deps from "../../utils/Deps";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";
import TicketingService from "../modules/Ticketing.service";

export default new (class ReadyHandler implements IEvent {
  on: keyof ClientEvents = "ready";
  type: EventType = 2;

  constructor(
    private SlashcommandService: SlashCommandService = Deps.get<SlashCommandService>(
      SlashCommandService
    ),
    private messageCommands: MessageCommandService = Deps.get<MessageCommandService>(
      MessageCommandService
    )
  ) {}

  invoke = async (bot: Client) => {
    Log.info(`It's live!`, "launcher");
    await this.messageCommands.init(); /** @INFO - Register Message Command Services */
    await this.SlashcommandService.init(); /** @INFO - Register Slash Command sServices */
    new TicketingService();

    await this.SlashcommandService.rest.put(
      Routes.applicationCommands(
        bot.user?.id as string
      ),
      {
        body: this.SlashcommandService.appCmds,
      }
    );

    setInterval(() => {
      const status =
        config.discord.messages[
          Math.floor(Math.random() * config.discord.messages.length)
        ];
      bot.user?.setActivity(status, { type: ActivityType.Playing });
    }, 30000);
  };
})();
