import {
  Client,
  GatewayIntentBits,
  OAuth2Scopes,
  PermissionFlagsBits,
  PermissionsBitField,
} from 'discord.js';
import Deps from './utils/Deps';
import config from './utils/Config';
import EventsRegistery from './services/events.service';
import mongoose from 'mongoose';

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

export var invite: string = '';
client.login(config.discord.token).then(() => {
  invite = client.generateInvite({
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    permissions: [
      PermissionFlagsBits.ManageGuild /** @INFO - Manage the icon, name, and others in servers. */,
      PermissionFlagsBits.AttachFiles /** @INFO - Attach files to messages sent in servers or for replys in interactions */,
      PermissionFlagsBits.KickMembers /** @INFO - Kick Members from the server */,
      PermissionFlagsBits.BanMembers /** @INFO - Ban members from the server. */,
      PermissionFlagsBits.ManageChannels /** @INFO - Manage Channels in the server (e.g. Could be used for a lock channels command) */,
      PermissionFlagsBits.Connect /** @INFO - Connect to Voice Channels. */,
      PermissionFlagsBits.ManageNicknames /** @INFO - For the Nickname Filtering module (I.E. Grants access for the bot to change other members usernames for the module). */,
      PermissionFlagsBits.ManageRoles /** @INFO - Could be used later in a module. */,
      PermissionFlagsBits.EmbedLinks /** @INFO - Allow the bot to embed messages */,
      PermissionFlagsBits.CreatePublicThreads /** @INFO - Would be used for the ticketing module, and same for CreatePrivateThreads */,
      PermissionFlagsBits.CreatePrivateThreads /** @INFO - Would be used for the ticketing module ^^ */,
      PermissionFlagsBits.ManageThreads /** @INFO - Would be used in the ticketing module. */,
      PermissionFlagsBits.ManageWebhooks /** @INFO - For logging events, etc. */,
      PermissionFlagsBits.ViewChannel /** @INFO - Basic permission that every bot needs */,
      PermissionFlagsBits.SendMessages /** @INFO - Basic permission that every bot needs */,
      PermissionFlagsBits.SendMessagesInThreads /** @INFO - Basic permission that every bot needs/should need */,
      PermissionFlagsBits.ReadMessageHistory /** @INFO - Basic permission that every bot needs/should need */,
      PermissionFlagsBits.UseExternalEmojis /** @INFO - Basic permission that every bot needs */,
      PermissionFlagsBits.UseExternalStickers /** @INFO - Basic permission that every bot needs */,
    ],
  });
});
