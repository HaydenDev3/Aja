import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  Colors,
  EmbedBuilder,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder,
  Snowflake,
} from 'discord.js';
import { GuildSettings } from '../../../database/models/GuildSetting';
import config from '../../../utils/Config';
import Command, { MessageCommandData } from '../../Command';

export default new (class HelpCommand implements Command {
  data: MessageCommandData = {
    name: 'register',
    summary:
      'Register your server into our databases to indoor your servers security.',
    permissions: ['ManageGuild'],
  };

  invoke = async (client: Client, message: Message) => {
    await message.channel.sendTyping().catch(() => {});
    const guildId = message.guildId as Snowflake;
    const savedGuild = await GuildSettings.findOne({ guildId });
    if (savedGuild) {
      return await message.reply({
        content: `> ${config.emojis.unicode.correct} This server is already **registered**.`,
      });
    }

    const embed = new EmbedBuilder({
      title: 'Confirm Server Registration',
      description: `Are you sure you want to register **${message.guild?.name}**?`,
      color: Colors.Blurple,
    });

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder({
        customId: 'register_yes',
        label: 'Yes',
        style: ButtonStyle.Success,
        emoji: config.emojis.id.correct,
      }),
      new ButtonBuilder({
        customId: 'register_no',
        label: 'No',
        style: ButtonStyle.Danger,
        emoji: config.emojis.id.wrong,
      })
    );

    const msg = await message.reply({
      embeds: [embed],
      components: [buttonRow as any],
    });

    const customIds = ['register_yes', 'register_no'];
    const filter = (i: any) => customIds.includes(i.customId);
    const collector = await message.createMessageComponentCollector({
      filter,
      time: 160000,
    });

    collector.on('collect', async (i: ButtonInteraction) => {
      if (!i.isButton()) return;
      if (i.customId === 'register_yes') {
        // Save the server settings to the database
        if (savedGuild) {
          await message.edit({
            content: `> ${config.emojis.unicode.wrong} **${message.guild?.name}** already exists within the *database**.`,
            embeds: [],
            components: [],
          });
        } else if (!savedGuild) {
          await GuildSettings.create({ _id: guildId });
          await message.edit({
            content: `> ${config.emojis.unicode.correct} **${message.guild?.name}** has been enrolled.`,
            embeds: [],
            components: [],
          });
        }
      } else {
        await message.edit({
          content: `> ${config.emojis.unicode.wrong} Registration cancelled.`,
          embeds: [],
          components: [],
        });
      }
    });

    collector.on('end', async () => {
      if (!(await msg)) {
        await msg.edit({
          components: [],
        });
      }
    });
  };
})();
