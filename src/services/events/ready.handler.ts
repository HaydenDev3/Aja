import { ActivityType, Client, ClientEvents, Routes } from "discord.js";
import { Dashboard } from "../../Dashboard/app";
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
    ),
    private dashboard: Dashboard = Deps.get<Dashboard>(Dashboard)
  ) {}

  invoke = async (bot: Client) => {
    Log.info(`It's live!`, "launcher");
    await this.messageCommands.init(); /** @INFO - Register Message Command Services */
    await this.SlashcommandService.init(); /** @INFO - Register Slash Command Services */
    this.dashboard.init(); /** @INFO - Initalizing the Dashboard's Server using Deps */
    /** @INFO - Remove all the Dashboard related stuff considering if you host you want Aja's dashboard you're not getting it. ~- No Offense ~- */

    new TicketingService();

    await this.SlashcommandService.rest.put(
      Routes.applicationCommands(bot.user?.id as string),
      {
        body: this.SlashcommandService.appCmds,
      }
    );

    setInterval(() => {
      const { name, type } =
        config.discord.messages.activities[
          Math.floor(Math.random() * config.discord.messages.activities!.length)
        ];
      bot.user?.setActivity(name, { type });
    }, 30000);
  };
})();
