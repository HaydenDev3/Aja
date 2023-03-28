"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SlashCommands_service_1 = __importDefault(
  require("../../commands/SlashCommands.service")
);
const GuildSetting_1 = require("../../database/models/GuildSetting");
const Deps_1 = __importDefault(require("../../utils/Deps"));
const Log_1 = __importDefault(require("../../utils/Log"));
exports.default = new (class InteractionCreateHandler {
  constructor(
    slashCommandService = Deps_1.default.get(SlashCommands_service_1.default),
    client = Deps_1.default.get(discord_js_1.Client)
  ) {
    this.slashCommandService = slashCommandService;
    this.client = client;
    this.on = "interactionCreate";
    this.type = 2;
    this.invoke = (interaction) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (interaction.isChatInputCommand()) {
          try {
            if (!interaction.isChatInputCommand()) return;
            if (!interaction.deferred)
              yield interaction
                .deferReply({ ephemeral: false })
                .catch(() => {});
            let savedGuild = yield GuildSetting_1.GuildSettings.findOne({
              _id: interaction.guildId,
            });
            let command = this.slashCommandService.slashCommands.get(
              interaction.commandName
            );
            if (!command) {
              yield interaction.followUp({
                embeds: [
                  new discord_js_1.EmbedBuilder()
                    .setDescription(
                      `> <:icons_Wrong:1043319853039222916> ***THIS COMMAND DOES NOT EXIST OR IS STILL LOADING***`
                    )
                    .setColor(discord_js_1.Colors.Red),
                ],
              });
              return;
            }
            yield command.invoke(this.client, interaction);
            Log_1.default.command(command, interaction.user, true);
          } catch (err) {
            Log_1.default.fail(err.message, "commands");
          }
        } else if (interaction.isButton()) {
          if (
            ((_a = interaction.customId) === null || _a === void 0
              ? void 0
              : _a.toLowerCase()) !== "hide_message"
          )
            return;
          yield interaction.message.delete().catch(() => {});
        }
      });
  }
})();
/**
 * @INFO
 * Aja is a security focused Discord bot, with Aja you can ensure that your server is secured with cutting-edge security features.
 * @INFO
 * Developed and Created by Hayden#8982.
 */
