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
const GuildSetting_1 = require("../../database/models/GuildSetting");
const Config_1 = __importDefault(require("../../utils/Config"));
const Deps_1 = __importDefault(require("../../utils/Deps"));
exports.default = new (class GuildCreateHandler {
  constructor(client = Deps_1.default.get(discord_js_1.Client)) {
    this.client = client;
    this.on = "guildCreate";
    this.type = 2;
    this.invoke = (guild) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        for (const id of Config_1.default.discord.ownerIds) {
          let owner = this.client.users.cache.get(id);
          const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`New Guild: ${guild.name}`)
            .setColor("#008000")
            .setDescription(
              `I've been added to a new guild: ${guild.name} (${guild.id}).`
            )
            .addFields([
              {
                name: "Owner",
                value:
                  ((_a = guild.members.cache.get(guild.ownerId)) === null ||
                  _a === void 0
                    ? void 0
                    : _a.user.tag) || "Unknown",
                inline: true,
              },
              { name: "Members", value: guild.memberCount, inline: true },
              {
                name: "Created At",
                value: guild.createdAt.toLocaleDateString(),
                inline: true,
              },
              {
                name: "Premium Progressed Bar",
                value: guild.premiumProgressBarEnabled,
                inline: true,
              },
              {
                name: "Verification Level",
                value: guild.verificationLevel.toString().toUpperCase(),
                inline: true,
              },
              { name: "Roles", value: guild.roles.cache.size, inline: true },
              {
                name: "Channels",
                value: guild.channels.cache.size,
                inline: true,
              },
            ]);
          const ch = yield guild.client.channels.cache.get(
            "1086484073800794274"
          );
          yield ch === null || ch === void 0
            ? void 0
            : ch.send({
                embeds: [embed],
                components: [],
              });
          const actionRow = new discord_js_1.ActionRowBuilder().addComponents(
            new discord_js_1.ButtonBuilder()
              .setCustomId("leave_guild")
              .setLabel("Leave Guild")
              .setStyle(discord_js_1.ButtonStyle.Danger),
            new discord_js_1.ButtonBuilder()
              .setCustomId("delete_guild_data")
              .setLabel("Delete Guild Data")
              .setStyle(discord_js_1.ButtonStyle.Danger),
            new discord_js_1.ButtonBuilder()
              .setCustomId("create_guild_data")
              .setLabel("Create Guild Data")
              .setStyle(discord_js_1.ButtonStyle.Success),
            new discord_js_1.ButtonBuilder()
              .setCustomId("export_guild_data")
              .setLabel("Export Guild Data")
              .setStyle(discord_js_1.ButtonStyle.Primary)
          );
          const dmChannel = yield owner.createDM(true);
          const message = yield dmChannel === null || dmChannel === void 0
            ? void 0
            : dmChannel.send({
                embeds: [embed],
                components: [actionRow],
              });
          const filter = (interaction) =>
            Config_1.default.discord.ownerIds.includes(interaction.user.id);
          const collector = yield dmChannel === null || dmChannel === void 0
            ? void 0
            : dmChannel.createMessageComponentCollector({
                filter,
                time: 60000,
              });
          collector.on("collect", (interaction) =>
            __awaiter(this, void 0, void 0, function* () {
              let savedGuild = yield GuildSetting_1.GuildSettings.findOne({
                _id: guild.id,
              });
              if (interaction.customId === "leave_guild") {
                yield guild.leave();
                yield interaction.reply("Left the guild.");
              } else if (interaction.customId === "delete_guild_data") {
                if (!savedGuild) {
                  yield interaction.reply(`Guild doesn't have any data`);
                } else {
                  yield GuildSetting_1.GuildSettings.deleteOne({
                    _id: guild.id,
                  });
                  yield interaction.reply("Deleted guild data.");
                  return;
                }
              } else if (interaction.customId === "create_guild_data") {
                if (!savedGuild) {
                  savedGuild = new GuildSetting_1.GuildSettings({
                    _id: guild.id,
                  });
                  yield savedGuild.save();
                } else savedGuild.toJSON();
                interaction.reply("Created guild data.");
              } else if (interaction.customId === "export_guild_data") {
                savedGuild = yield GuildSetting_1.GuildSettings.findOne({
                  guildId: guild.id,
                });
                const data =
                  savedGuild === null || savedGuild === void 0
                    ? void 0
                    : savedGuild.toJSON();
                const jsonData = JSON.stringify(data, null, 2);
                const attachment = new discord_js_1.AttachmentBuilder(
                  Buffer.from(jsonData),
                  {
                    name: `${guild.id}.json`,
                  }
                );
                interaction.reply({
                  files: [attachment],
                  content: "Here is the guild data.",
                });
              }
            })
          );
          collector.on("end", () =>
            __awaiter(this, void 0, void 0, function* () {
              yield message.edit({ components: [] });
            })
          );
        }
      });
  }
})();
