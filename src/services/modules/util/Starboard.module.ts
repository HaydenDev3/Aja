import { Guild, Message, TextChannel, User } from "discord.js";
import { GuildSettings } from "../../../database/models/GuildSetting";
import RegisteringService from "../../registering.service";

export default class StarboardModule extends RegisteringService {
    public async init (message: Message) {
        const { guild, author, channel, content } = message;
        if ( !guild ) return;

        const savedGuild = await GuildSettings.findOne({ _id: guild!.id }) || 
            await GuildSettings.create({ _id: guild!.id });
        const starboard = savedGuild.starboard;

        // Check if starboard is enabled and message meets the threshold
        if (starboard.enabled && message.reactions.cache.get('⭐')!.count >= starboard.threshold) {
            
            // Create new starboard message
            const starChannel = guild.channels.cache.get(starboard.channelId) as TextChannel;
            if (!starChannel) {
                return;
            }
            
            // Check if message is already in starboard
            const existingMsg = await (await starChannel.messages.fetch())!.find((msg: Message) => msg.id == message.id)
            if (existingMsg) {
                await existingMsg.edit({
                    content: `${message.reactions.cache.get('⭐')!.count} ⭐ | ${channel} | ${author}\n${content}`,
                    files: message.attachments.map(attachment => attachment.url)
                })
            } else {
                /** @INFO - Send the message if there isn't already a message already existing... */
                await starChannel.send({
                    content: `${message.reactions.cache.get('⭐')!.count} ⭐ | ${channel} | ${author}\n${content}`,
                    files: message.attachments.map(attachment => attachment.url)
                }); 
            };
        }
    }
}