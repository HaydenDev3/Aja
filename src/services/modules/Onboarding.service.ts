import RegisteringService from "../registering.service";
import { APIEmbed, ButtonBuilder, ActionRowBuilder, MessageComponentInteraction, ButtonStyle } from "discord.js";

export default class OnboardingService extends RegisteringService {
  public embeds: APIEmbed[] = [];
  public components: ActionRowBuilder[] = [];

  constructor() {
    super();
  }

  public addEmbed(embed: APIEmbed) {
    this.embeds.push(embed);
  }

  public addComponent(component: ActionRowBuilder) {
    this.components.push(component);
  }

  public async handleInteraction(interaction: MessageComponentInteraction) {
    const component = this.components.find((component) =>
      component.components.some(
        (c: any) => c.customId === interaction.customId && c.type === "BUTTON"
      )
    );

    if (!component) return;

    const button = component.components.find(
      (c: any) => c.customId === interaction.customId && c.type === "BUTTON"
    ) as ButtonBuilder;

    if (!button) return;

    if (button.data.style === ButtonStyle.Link) {
      await interaction.reply({
        content: `You clicked a link button: ${button.data.url}`,
        ephemeral: true,
      });
    } else {
      const embed = this.embeds.find((e) => e.title === button.data.label?.replace(" ", "_").toLowerCase());
      if (!embed) return;

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  }
}