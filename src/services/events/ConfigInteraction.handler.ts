import {
  AttachmentBuilder,
  ButtonInteraction,
  ClientEvents,
  MessageComponentInteraction,
} from "discord.js";
import { GuildSettings } from "../../database/models/GuildSetting";
import config from "../../utils/Config";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";

export default new (class ConfigInteractionHandler implements IEvent {
  on: keyof ClientEvents = "interactionCreate";
  type: EventType = 2;

  invoke = async (interaction: MessageComponentInteraction) => {
    const customIds = ["export_guild_data", "config"] as string[];
    if (!customIds.includes(interaction.customId)) return;
    if (!interaction.deferred)
      return await interaction.deferReply({ ephemeral: true });
    console.log(interaction);
    const savedGuild = await GuildSettings.findOne({
      _id: interaction.guildId,
    });

    if (!savedGuild) {
      await interaction.followUp({
        content: "Sorry, there is no data to export for this guild.",
        ephemeral: true,
      });
      return;
    }

    if (
      interaction.isButton() &&
      interaction.customId === "export_guild_data"
    ) {
      try {
        const dataBuffer = Buffer.from(
          JSON.stringify(savedGuild)
        ); /** @INFO - Converting SavedGuild into a JSON file thats Bufferd */
        const attachment = new AttachmentBuilder(dataBuffer, {
          name: "guildData.json",
        }); /** @INFO - Creating the file attachment. */
        await interaction.followUp({
          ephemeral: true,
          content: `${config.emojis.unicode.correct} Here you go:`,
          files: [attachment],
        }); /** * @INFO - reply with file attached */
      } catch (error) {
        Log.fail(error, "guild_settings");
        await interaction.followUp(
          "An error occurred while exporting the data."
        ); /** @INFO - If error log error in chat and console. */
      }
    }
    if (interaction.isAnySelectMenu() && interaction.customId === "config") {
      const [value] = interaction.values as any;
      const module = savedGuild[value] as any;

      module!.enabled = !module.enabled;
      await savedGuild.save();

      await interaction.followUp({
        content: `> ${config.emojis.unicode.correct} Successfully toggled ${
          module?.enabled ? "on" : "off" 
        } ${module?.toUpperCase()} module.`
      })
    }
  };
})();
