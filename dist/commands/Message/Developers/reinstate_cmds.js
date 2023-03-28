"use strict";
// import { ButtonStyle, Client, codeBlock, Message, Routes, SlashCommandBuilder } from "discord.js";
// import { inspect } from "util";
// import config from "../../../utils/Config";
// import Deps from "../../../utils/Deps";
// import Log from "../../../utils/Log";
// import Command, { MessageCommandData } from "../../Command";
// import MessageCommandService from "../../Commands.service";
// import SlashCommandService from "../../SlashCommands.service";
// export default new class ReinstateCommandsCommand implements Command {
//     data: MessageCommandData = {
//         name: "reinstate_commands",
//         summary: "Synchronizes and refreshes both Slash commands and Message commands.",
//         permissions: [],
//         cooldown: 5000
//     };
//     constructor (
//         private slashCommands: SlashCommandService = Deps.get<SlashCommandService>(SlashCommandService),
//         private commands: MessageCommandService = Deps.get<MessageCommandService>(MessageCommandService)) {};
//     invoke = async (client: Client, message: Message, code: any) => {
//         await message.channel.sendTyping()
//         if (!config.discord.ownerIds.includes(message.author.id)) {
//             await message.channel.send({
//                 content: `> <a:Alert:936155561878245397> This is owner only`
//             })
//             return;
//         }
//         try {
//             await this.slashCommands.refreshCommands(client.user?.id as string, "1043318603392483358");
//             await message.reply({
//                 content: `> ${config.emojis.unicode.correct} Successfully reloaded ${config.emojis.unicode.slashCommand} \`${this.slashCommands.slashCommands.size}\` Slash Commands and \`${this.commands.commands.size}\` Message Commands`,
//             })
//         } catch (error: any) {
//             await message.channel.send(`> <a:Alert:936155561878245397> An Error was detected\n${codeBlock(error.message ?? "Unknown Error")}`);
//             Log.fail(error.stack, 'commands');
//         }
//     };
// }
