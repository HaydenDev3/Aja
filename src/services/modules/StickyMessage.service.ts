import { Client, ButtonBuilder, ActionRowBuilder, ButtonStyle, TextChannel, ButtonInteraction, Message, Guild } from "discord.js";
import { GuildSettings, IButton, StickyMessage } from "../../database/models/GuildSetting";
import Deps from "../../utils/Deps";
import RegisteringService from "../registering.service";

export default class StickyMessagesModule extends RegisteringService {
  constructor(
    ) {
    super();
    this.client.on("interactionCreate", async (interaction: any) => await this.onInteractionCreate(interaction));
  }
  
  async fetch (guild: Guild) {
    const savedGuild = await GuildSettings.findOne({ _id: guild.id }) || await GuildSettings.create({ _id: guild.id });
    return savedGuild.stickyMessages;
  };

  async createStickyMessage(guild: Guild, channel: TextChannel, messageContent: string) {
    const savedGuild = await GuildSettings.findOne({ _id: guild.id }) || await GuildSettings.create({ _id: guild.id });
    const message = await channel.send({ content: messageContent, components: [this.getStickyMessageButtons() as any] });
    let StickyMessageData = new StickyMessage()
        .setChannelId(channel.id)
        .setMessage(message)
        .setButtons(await message.components[0].components as any[])
        .setMessageId(await message.id);
    
    savedGuild.stickyMessages.push(StickyMessageData);
    await savedGuild.save();
  }

  async getStickyMessage(channel: TextChannel) {
    const savedGuild = await GuildSettings.findOne({ _id: channel.guild.id }) || await GuildSettings.create({ _id: channel.guild.id });
    var message = savedGuild.stickyMessages.find((x: StickyMessage) => x.message.id === channel.id);
    if (!message) return null;
    return message;
  }

  async delete(message: StickyMessage) {
    const savedGuild = await GuildSettings.findOne({ _id: message.message.guild.id }) || await GuildSettings.create({ _id: message.message.guild.id });
    const index = savedGuild.stickyMessages.findIndex((x: StickyMessage) => x.message.id === message.message.id);
    if (index !== -1) {
      await message.message.delete();
      savedGuild.stickyMessages.splice(index, 1);
      await savedGuild.save();
    }
  }

  async deleteStickyMessage(channelId: string) {
    const savedGuild = await GuildSettings.findOne({ "stickyMessages.channelId": channelId });
    if (savedGuild) {
      const index = savedGuild.stickyMessages.findIndex((x: StickyMessage) => x.channelId === channelId);
      if (index !== -1) {
        await this.delete(savedGuild.stickyMessages[index]);
      }
    }
  }

  public getStickyMessageButtons() {
    const button = new ButtonBuilder()
      .setCustomId("delete_sticky")
      .setLabel("Delete Sticky Message")
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(button);
    return [row];
  }

  async updateStickyMessage(stickyMessage: StickyMessage, options: { buttons?: IButton[], content: string }, guild: Guild): Promise<void> {  
    await stickyMessage.message.edit(options.content);
    const savedGuild = await GuildSettings.findOne({ _id: guild.id }) || await GuildSettings.create({ _id: guild.id });
    const savedStickyMessages = savedGuild.stickyMessages || [];
    const index = savedStickyMessages.findIndex(m => m.channelId === stickyMessage.channelId);
    if (index >= 0) {
        let msg = savedStickyMessages[index] as any;
        msg = options.buttons ? {
            content: options.content,
            channelId: stickyMessage.channelId,
            messageId: stickyMessage.messageId,
            buttons: options.buttons,
            updatedAt: new Date(),
      } : {
        content: options.content,
        channelId: stickyMessage.channelId,
        messageId: stickyMessage.messageId,
        updatedAt: new Date(),
      }; 
    }
    await savedGuild.save();
  };

  async onInteractionCreate(interaction: ButtonInteraction) {
    if (!interaction?.isButton()) return;
  
    const savedGuild = await GuildSettings.findOne({ _id: interaction?.guildId }) || await GuildSettings.create({ _id: interaction.guildId });
    const stickyMessage = savedGuild.stickyMessages.find(msg => msg.messageId === interaction.message.id);
    if (!stickyMessage) return;
  
    if (interaction.customId === "delete_sticky") {
      await interaction.message.delete();
      const index = savedGuild.stickyMessages.indexOf(stickyMessage);
      savedGuild.stickyMessages.splice(index, 1);
      await savedGuild.save();
    }
  }
}
