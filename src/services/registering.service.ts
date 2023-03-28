import Discord, { Client, Collection, Events, REST, Routes } from "discord.js";
import fs from "fs";
import util from "util";
import Command from "../commands/Command";
import SlashCommand from "../commands/SlashCommand";
import Deps from "../utils/Deps";
import { glob } from "glob";
import Log from "../utils/Log";

export default class RegisteringService {
  public readdir = util.promisify(fs.readdir);
  public client: Client = Deps.get<Client>(Client);
  public commands: Collection<string, Command> = new Collection();
  public slashCommands: Collection<string, SlashCommand> = new Collection();
  public globPromise = util.promisify(glob);
  public aliases: Collection<string, string> = new Collection();

  constructor() {}

  public rest: REST = new REST({ version: "10" }).setToken(
    this.client.token as string
  );

  public async refreshCommands(clientId: string, guildId: string) {
    const { messageCommands, slashCommands } = await this.getCommands();

    if (guildId) {
      await this.rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: slashCommands,
      });
    } else {
      await this.rest.put(Routes.applicationCommands(clientId), {
        body: slashCommands,
      });
    }

    Log.info("Refreshed (/) Slash Commands", "commands");
  }

  public async getCommands() {
    return {
      slashCommands: this.slashCommands,
      messageCommands: this.commands,
    };
  }

  public async importFile(file: string) {
    return (await import(file))?.default;
  }
}
