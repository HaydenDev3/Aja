import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  codeBlock,
  Message,
  MessageComponentInteraction,
} from "discord.js";
import { inspect } from "util";
import config from "../../../utils/Config";
import Log from "../../../utils/Log";
import Command, { MessageCommandData } from "../../Command";

export default new (class GuildsCommand implements Command {
  data: MessageCommandData = {
    name: "guilds",
    summary: "Lists all guilds the bot is in",
    permissions: [],
    cooldown: 5000,
  };

  invoke = async (client: Client, message: Message) => {
    await message.channel.sendTyping();
    if (!config.discord.ownerIds.includes(message.author.id)) return;

    const guilds = Array.from(client.guilds.cache.values());
    const totalGuilds = guilds.length;

    if (totalGuilds === 0) {
      await message.reply(
        `> ${config.emojis.unicode.wrong} I am not in any guilds.`
      );
      return;
    }

    const rowsPerPage = 10;
    const totalPages = Math.ceil(totalGuilds / rowsPerPage);
    let currentPage = 1;

    try {
      const generatePage = (pageNumber: number) => {
        const startIndex = (pageNumber - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const guildList = guilds.slice(startIndex, endIndex);
        const formattedGuildList = guildList
          .map((guild: any) => `• ${guild.name} (${guild.id})`)
          .join("\n");

        const pageMessage = `Page ${pageNumber} of ${totalPages}:\n${formattedGuildList}`;

        const buttons = [
          new ButtonBuilder()
            .setLabel("Support")
            .setURL(config.discord.supportServerURL)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.emojis.id.generalinfo),
        ] as Array<ButtonBuilder>;

        if (pageNumber > 1) {
          buttons.push(
            new ButtonBuilder()
              .setCustomId("prev_page")
              .setLabel("Previous Page")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji(config.emojis.id.leftarrow)
          );
        }

        if (pageNumber < totalPages) {
          buttons.push(
            new ButtonBuilder()
              .setCustomId("next_page")
              .setLabel("Next Page")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji(config.emojis.id.rightarrow)
          );
        }

        return {
          content: pageMessage,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
          ],
        };
      };

      const initialPage = await message.reply(generatePage(currentPage));

      const filter = (interaction: MessageComponentInteraction) => {
        if (interaction.user.id !== interaction.client.user.id) {
          return false;
        }

        if (!interaction.isButton()) {
          return false;
        }

        if (
          interaction.customId !== "prev_page" &&
          interaction.customId !== "next_page"
        ) {
          return false;
        }

        return true;
      };

      const collector = message.createMessageComponentCollector({
        filter,
        time: 120000,
      });

      collector.on("collect", async (interaction) => {
        await interaction.deferUpdate();

        if (interaction.customId === "prev_page") {
          currentPage--;
        } else {
          currentPage++;
        }

        await initialPage.edit(generatePage(currentPage));
      });

      collector.on("end", async () => {
        await initialPage.edit({
          content: "This session has expired",
          components: [],
        });
      });
    } catch (error: any) {
      await message.channel.send(
        `> <a:Alert:936155561878245397> An Error was detected\n${codeBlock(
          error.message ?? "Unknown Error"
        )}`
      );
      Log.fail(error.stack, "commands");
    }
  };
})();
