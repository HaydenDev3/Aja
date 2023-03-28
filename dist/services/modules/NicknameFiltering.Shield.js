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
class NicknameFiltering extends registering_service_1.default {
  constructor() {
    super();
  }
  init(member) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (member.user.bot || member.nickname === "") return;
      const savedGuild = yield GuildSetting_1.GuildSettings.findOne({
        _id: member.guild.id,
      });
      if (
        !(savedGuild === null || savedGuild === void 0
          ? void 0
          : savedGuild.welcoming.nicknameFiltering.enabled) ||
        !savedGuild
      )
        return;
      const nicknameFiltering =
        savedGuild === null || savedGuild === void 0
          ? void 0
          : savedGuild.welcoming.nicknameFiltering;
      const filteredNickname =
        (_a = nicknameFiltering.filtered) === null || _a === void 0
          ? void 0
          : _a.includes(
              (_b = member.nickname) !== null && _b !== void 0
                ? _b
                : member.user.username
            );
      if (filteredNickname) {
        for (const action of nicknameFiltering.action) {
          switch (action) {
            case "modify": {
              const id = Math.floor(Math.random() * 10000) + 5000;
              try {
                yield member.setNickname(`Moderated Nickname ${id}`);
              } catch (error) {
                console.error(`Failed to modify nickname: ${error}`);
              }
              break;
            }
            case "ban": {
              yield member.ban({
                reason: `Auto Moderation for: Nickname Filtering`,
              });
              break;
            }
            case "kick": {
              yield member.kick(`Auto Moderation for: Nickname Filtering`);
              break;
            }
            case "warn": {
              const newData = yield Infraction_1.InfractionModel.create({
                _id: member.guild.id,
                memberId:
                  member === null || member === void 0 ? void 0 : member.id,
                reason: "New Infraction for: Nickname Filtering",
                date: new Date(),
              });
              yield newData.save();
              yield member.send(
                `You've been warned for: \`${newData.reason}\``
              );
              break;
            }
            default: {
              console.error(`Invalid action: ${action}`);
            }
          }
        }
      }
    });
  }
}
exports.default = NicknameFiltering;
