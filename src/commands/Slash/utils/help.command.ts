import {
  ActionRowBuilder,
  ApplicationCommand,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Colors,
  EmbedBuilder,
  Message,
  MessageComponentInteraction,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
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
    const commands = await await client.application?.commands.fetch();
    if (!commands) {
      console.log(`❌ No global slash commands found.`);
      return; 
    }

    const commandList = commands
      .map((command: ApplicationCommand) => {
        if (command.type) {
          return `\`${command.name}\` - Context`;
        } else return `</${command.name}:${command.id}>`;
      })
      .join(", ");

    const message = await interaction.followUp({
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
              name: `${config.emojis.unicode.slashCommand} Commands`,
              value: commandList,
              inline: true,
            },
            {
              name: `What do our ${config.emojis.unicode.vip} Shields do?`,
              value: ``,
            },
          ])
          .setColor(Colors.Blurple),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("guide")
            .setPlaceholder("Select a guide to start getting help!")
            .setDisabled(false)
            .addOptions([
              new StringSelectMenuOptionBuilder()
                .setLabel(`Commands`)
                .setValue(`commands`)
                .setDescription(`View the commands guide`)
                .setEmoji(config.emojis.id.slashCommand)
                .setDefault(true),
              new StringSelectMenuOptionBuilder()
                .setLabel(`What are Shields?`)
                .setValue(`shields_guide`)
                .setEmoji(config.emojis.id.vip)
                .setDescription(`View the Shields guide`),
            ])
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder({
            type: 2,
            label: "Hide Message",
            customId: "hide_message",
            disabled: false,
            emoji: "1008179260621590528",
            style: ButtonStyle.Secondary,
          })
        ),
      ],
    });

    const filter = (i: MessageComponentInteraction) =>
      i.customId === "guide" && i.isStringSelectMenu();

    const collector = message.createMessageComponentCollector({
      filter,
      time: 120000,
    });

    collector.on(
      "collect",
      async (interaction: StringSelectMenuInteraction) => {
        if (interaction.customId !== "guide") return;

        const [value] = interaction.values;
        switch (value) {
          case "commands": {
            await message.edit({
              embeds: [
                new EmbedBuilder()
                  .setThumbnail(
                    "https://cdn.discordapp.com/emojis/1086196240208891944.webp?size=240&quality=lossless"
                  )
                  .setTitle(`Here's a guide for Commands`)
                  .setDescription(
                    `> *Here's some commands that are available to you:*\n${commandList}`
                  )
                  .setColor(Colors.Blurple),
              ],
            });
            break;
          }
          case "shields_guide": {
            await message.edit({
              embeds: [
                new EmbedBuilder()
                  .setThumbnail(
                    "https://cdn.discordapp.com/emojis/1090080882091626577.webp?size=240&quality=lossless"
                  )
                  .setTitle(`What are Shields?`)
                  .setDescription(
                    `> ${config.emojis.unicode.reply} Our **Shields** module allows your server to be protected from rule-breakers, you can enable the feature from using the ${config.emojis.unicode.slashCommand} \`/config\` command, however, if you haven't enrolled your guild do that by using the ${config.emojis.unicode.slashCommand} \`/register\` command.}`
                  )
                  .setColor(Colors.Blurple),
              ],
            });
            break;
          }
        }
      }
    );

    collector.on("end", async () => {
      await message.edit({
        content:
          "Your session has expired, please reuse the command to get this again",
        embeds: [],
        components: [],
      });
    });
  };
})();
