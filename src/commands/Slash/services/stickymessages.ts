import {
    ApplicationCommandDataResolvable,
    ApplicationCommandOptionType,
    ChannelType,
    ChatInputCommandInteraction,
    Client,
} from "discord.js";
import { GuildSettings } from "../../../database/models/GuildSetting";
import StickyMessagesModule from "../../../services/modules/StickyMessage.service";
import config from "../../../utils/Config";
import Deps from "../../../utils/Deps";
import Log from "../../../utils/Log";
import SlashCommand from "../../SlashCommand";
  
export default new (class StickyMessagesCommand implements SlashCommand {
    data: ApplicationCommandDataResolvable = {
        name: "stickymessage",
        description: 'Create, update or delete a sticky message',
        default_member_permissions: 48,
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "create",
                description: 'Create a new sticky message',
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: 'The channel to create the sticky message in',
                        channel_types: [ChannelType.GuildText],
                        required: true
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "content",
                        description: 'The content of the sticky message',
                        required: true
                    },
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "edit",
                description: 'Edit a existing sticky message',
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: 'The channel where the sticky message is located',
                        channel_types: [ChannelType.GuildText],
                        required: true,
                    },
                    {
                            type: ApplicationCommandOptionType.String,
                            name: "content",
                            description: 'The new content of the sticky message',
                            channel_types: [ChannelType.GuildText],
                            required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "delete",
                description: 'Delete a sticky message',
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: "channel",
                        description: 'The channel where the sticky message is located',
                        channel_types: [ChannelType.GuildText],
                        required: true
                    }
                ]
            },
        ]
    }; 

    constructor (
        private StickyMessagesService: StickyMessagesModule = Deps.get<StickyMessagesModule>(StickyMessagesModule)) {};
  
    invoke = async (
      client: Client,
      interaction: ChatInputCommandInteraction
    ) => {
        const subcommand = await interaction.options.getSubcommand();
        const channel = await interaction.options.getChannel('channel', false);
        const content = await interaction.options.getString('content', false);

        switch (subcommand) {
            case "create": {
                if (!content) {
                  return interaction.followUp(
                    `${config.emojis.unicode.wrong} Please provide the content for the sticky message.`
                  );
                }
        
                try {
                  await this.StickyMessagesService.createStickyMessage(
                    interaction.guild!,
                    channel as any,
                    content
                  );
                  return interaction.followUp(
                    `${config.emojis.unicode.correct} Successfully created a sticky message in ${channel}.`
                  );
                } catch (error) {
                  console.error(error);
                  return interaction.followUp(
                    `${config.emojis.unicode.wrong} An error occurred while creating the sticky message.`
                  );
                }
            }
            case 'edit': {
                if (!content) {
                  return interaction.reply('Please provide the new content for the sticky message.');
                }
              
                const savedGuild = await GuildSettings.findOne({ _id: interaction.guild?.id }) || await GuildSettings.create({ _id: interaction.guild?.id });
                const stickyMessages = savedGuild.stickyMessages;
              
                if (!stickyMessages || stickyMessages.length === 0) {
                  return interaction.followUp(`${config.emojis.unicode.wrong} There are no sticky messages in this guild.`);
                }
              
                const stickyMessage = stickyMessages.find((m) => m.channelId === channel?.id);
              
                if (!stickyMessage) {
                  return interaction.followUp(`${config.emojis.unicode.wrong} There is no sticky message in that channel.`);
                }
              
                try {
                  await this.StickyMessagesService.updateStickyMessage(stickyMessage, { content }, interaction.guild as any);
                  return interaction.followUp(`${config.emojis.unicode.correct} Successfully updated the sticky message in ${channel}.`);
                } catch (error) {
                  Log.fail(error);
                  return interaction.followUp(`${config.emojis.unicode.wrong} An error occurred while updating the sticky message.`);
                }
            }
              
            case 'delete': {
              const stickyMessage = (channel);
      
              if (!stickyMessage) {
                return interaction.followUp(`${config.emojis.unicode.correct} There is no sticky message in that channel.`);
              }
      
              try {
                await this.StickyMessagesService.deleteStickyMessage(interaction.channelId);
                return interaction.followUp(`${config.emojis.unicode.correct} Successfully deleted the sticky message in ${channel}.`);
              } catch (error) {
                Log.fail(error);
                return interaction.followUp(`${config.emojis.unicode.wrong} An error occurred while deleting the sticky message.`);
              }
            }
        }
    };
  })();
  