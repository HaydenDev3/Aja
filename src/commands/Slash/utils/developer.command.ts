import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import SlashCommand from "../../SlashCommand";

export default new (class DeveloperInfoCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("developer")
    .setDescription("Recieve information about the developer of this bot.");

  invoke = async (client: Client, interaction: ChatInputCommandInteraction) => {
    const embed = new EmbedBuilder()
      .setTitle("Hayden")
      .setURL("https://haydenf.cloud")
      .setDescription(
        `> <:replycontinue:998771075427094539> 👋 Hola, I am Hayden, [he/him].\n> <:replycontinue:998771075427094539> Contact me @ \`hayden@haydenf.cloud\`\n> <:reply:878577643300204565> Vist [My Website](https://www.haydenf.cloud/)`
      );

    const components = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel(`Website`)
        .setDisabled(false)
        .setURL("https://www.haydenf.cloud")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel(`Invite Aja`)
        .setDisabled(true)
        .setURL("https://aja.haydenf.cloud")
        .setStyle(ButtonStyle.Link),
    ]);

    await interaction
      .followUp({
        embeds: [embed],
        components: [components as any],
      })
      .catch(() => {});
  };
})();
