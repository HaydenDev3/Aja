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
const GuildSetting_1 = require("../../database/models/GuildSetting");
const Infraction_1 = require("../../database/models/Infraction");
const registering_service_1 = __importDefault(
  require("../registering.service")
);
class MessageFiltering extends registering_service_1.default {
  constructor() {
    super();
  }
  init(message) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
      if (message.author.bot || message.guild === null) return;
      const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
        _id: message.guild.id,
      });
      if (
        !(savedGuild === null || savedGuild === void 0
          ? void 0
          : savedGuild.messageFiltering.enabled) ||
        !savedGuild
      )
        return;
      const messageFiltering = yield savedGuild.messageFiltering;
      const isFiltered = () =>
        messageFiltering.bannedWords.includes(message.cleanContent) ||
        messageFiltering.bannedLinks.includes(message.cleanContent);
      const action = messageFiltering.action;
      if (isFiltered()) {
        if (action === "ban") {
          yield (_a = message.member) === null || _a === void 0
            ? void 0
            : _a.ban({ reason: "Banned for Auto Moderation" });
          yield (_b = message.member) === null || _b === void 0
            ? void 0
            : _b.send({
                content: messageFiltering.banMessage,
              });
        } else if (action === "warn") {
          yield message.delete().catch(() => {});
          const msg = yield message.reply({
            content: messageFiltering.warningMessage,
          });
          const newData = yield Infraction_1.InfractionModel.create({
            _id: message.guild.id,
            memberId:
              (_c = message.member) === null || _c === void 0 ? void 0 : _c.id,
            reason: "Warned for Auto Moderation",
            date: new Date(),
          });
          yield newData.save();
          setTimeout(
            () =>
              __awaiter(this, void 0, void 0, function* () {
                yield msg.delete().catch(() => {});
              }),
            5000
          );
        } else if (action == "kick") {
          yield (_d = message.member) === null || _d === void 0
            ? void 0
            : _d.kick("Banned for Auto Moderation");
          yield (_e = message.member) === null || _e === void 0
            ? void 0
            : _e.send({
                content: messageFiltering.kickMessage,
              });
        }
      }
    });
  }
}
exports.default = MessageFiltering;
