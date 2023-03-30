import {
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Colors,
  EmbedBuilder,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import config from "../../../utils/Config";
import Command, { MessageCommandData } from "../../Command";
import SlashCommand from "../../SlashCommand";

export default new (class HelpCommand implements SlashCommand {
  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Recieve help upon using this command.")
    .setDMPermission(true);

  invoke = async (client: Client, interaction: ChatInputCommandInteraction) => {
    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setThumbnail(client.user!.displayAvatarURL({ forceStatic: true }))
          .setTitle(`${client.user?.username}'s Guidance Centre`)
          .setURL(`https://aja.haydenf.cloud`)
          .setDescription(
            `> ${config.emojis.unicode.reply} **Aja** is a security focused Discord bot, with Aja you can ensure that your server is secured with cutting-edge security features.`
          )
          .addFields([
            {
              name: `How to use ${config.emojis.unicode.slashCommand} Commands?`,
              value: `> ${config.emojis.unicode.reply} In-order to use ${config.emojis.unicode.slashCommand} **Slash Commands** start by typing \`/\` and then a sidebar should show with icons and one of those should have **Aja's** avatar click on it, afterwards, there you go you now have access to use all of **Aja's** Slash Commands.`,
            },
            {
              name: `What do our ${config.emojis.unicode.vip} Shields do?`,
              value: `> ${config.emojis.unicode.reply} Our **Shields** module allows your server to be protected from rule-breakers, you can enable the feature from using the ${config.emojis.unicode.slashCommand} \`/config\` command, however, if you haven't enrolled your guild do that by using the ${config.emojis.unicode.slashCommand} \`/register\` command.`,
            },
          ])
          .setColor(Colors.Blurple),
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Hide Message",
              customId: "hide_message",
              disabled: false,
              emoji: "1008179260621590528",
              style: ButtonStyle.Secondary,
            },
          ],
        },
      ],
    });
  };
})();
