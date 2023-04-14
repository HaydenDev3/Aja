import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  GuildChannelManager,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  TextChannel,
  NewsChannel,
} from 'discord.js';
import config from '../../../utils/Config';
import Log from '../../../utils/Log';
import SlashCommand from '../../SlashCommand';

export default new (class NewsCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName('news')
    .setDescription('Allow news to be sent to your server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option: SlashCommandChannelOption) =>
      option
        .setName('channel')
        .setDescription('Recieve news in another channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    );

  invoke = async (client: Client, interaction: ChatInputCommandInteraction) => {
    let channel =
      interaction.options.getChannel('channel', false) || interaction.channel;
    if (!channel)
      return await interaction.followUp({
        content: `> ${config.emojis.unicode.wrong} No channel was provided`,
        ephemeral: true,
      });

    const manager = interaction.guild!.channels as GuildChannelManager;
    const news = client.channels.cache.get(
      '1040173761451786271'
    ) as NewsChannel;

    try {
      await news.addFollower(channel as TextChannel, 'News Forwarding');
      await interaction.followUp({
        content: `> ${config.emojis.unicode.correct} Thanks for following our news program! Binded channel to ${channel}!`,
        ephemeral: true,
      });
    } catch (error: any) {
      Log.fail(error, 'commands');
      await interaction.followUp(
        'An error occurred while following the channel.'
      );
    }
  };
})();
