import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import Deps from "./utils/Deps";
import Log from "./utils/Log";
import config from "./utils/Config";
import EventsRegistery from "./services/events.service";
import mongoose from "mongoose";

export const client: Client = Deps.add<Client>(
  Client,
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessages,
    ],
  })
);

mongoose.connect(config.database.uri, config.database.options);

Deps.get<EventsRegistery>(EventsRegistery).init();

client.login(config.discord.token);

/** @INFO - Opening express server */
// Now imported to ready.handler.ts -> Dashboard is coming soon.