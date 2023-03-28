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
const GuildSetting_1 = require("../../../database/models/GuildSetting");
const Config_1 = __importDefault(require("../../../utils/Config"));
exports.default = new (class HelpCommand {
  constructor() {
    this.data = {
      name: "register",
      summary:
        "Register your server into our databases to indoor your servers security.",
      permissions: ["ManageGuild"],
    };
    this.invoke = (client, message) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield message.channel.sendTyping().catch(() => {});
        const guildId = message.guildId;
        const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
          guildId,
        });
        if (savedGuild) {
          return yield message.reply({
            content: `> ${Config_1.default.emojis.unicode.correct} This server is already **registered**.`,
          });
        }
        const embed = new discord_js_1.EmbedBuilder({
          title: "Confirm Server Registration",
          description: `Are you sure you want to register **${
            (_a = message.guild) === null || _a === void 0 ? void 0 : _a.name
          }**?`,
          color: discord_js_1.Colors.Blurple,
        });
        const buttonRow = new discord_js_1.ActionRowBuilder().addComponents(
          new discord_js_1.ButtonBuilder({
            customId: "register_yes",
            label: "Yes",
            style: discord_js_1.ButtonStyle.Success,
            emoji: Config_1.default.emojis.id.correct,
          }),
          new discord_js_1.ButtonBuilder({
            customId: "register_no",
            label: "No",
            style: discord_js_1.ButtonStyle.Danger,
            emoji: Config_1.default.emojis.id.wrong,
          })
        );
        const msg = yield message.reply({
          embeds: [embed],
          components: [buttonRow],
        });
        const customIds = ["register_yes", "register_no"];
        const filter = (i) => customIds.includes(i.customId);
        const collector = yield message.createMessageComponentCollector({
          filter,
          time: 160000,
        });
        collector.on("collect", (i) =>
          __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            if (!i.isButton()) return;
            if (i.customId === "register_yes") {
              // Save the server settings to the database
              if (savedGuild) {
                yield message.edit({
                  content: `> ${Config_1.default.emojis.unicode.wrong} **${
                    (_b = message.guild) === null || _b === void 0
                      ? void 0
                      : _b.name
                  }** already exists within the *database**.`,
                  embeds: [],
                  components: [],
                });
              } else if (!savedGuild) {
                yield GuildSetting_1.GuildSettings.create({ _id: guildId });
                yield message.edit({
                  content: `> ${Config_1.default.emojis.unicode.correct} **${
                    (_c = message.guild) === null || _c === void 0
                      ? void 0
                      : _c.name
                  }** has been enrolled.`,
                  embeds: [],
                  components: [],
                });
              }
            } else {
              yield message.edit({
                content: `> ${Config_1.default.emojis.unicode.wrong} Registration cancelled.`,
                embeds: [],
                components: [],
              });
            }
          })
        );
        collector.on("end", () =>
          __awaiter(this, void 0, void 0, function* () {
            if (!(yield msg)) {
              yield msg.edit({
                components: [],
              });
            }
          })
        );
      });
  }
})();
