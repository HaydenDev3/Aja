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
const Deps_1 = __importDefault(require("../../utils/Deps"));
const MemberClearance_Shield_1 = __importDefault(
  require("../modules/MemberClearance.Shield")
);
const NicknameFiltering_Shield_1 = __importDefault(
  require("../modules/NicknameFiltering.Shield")
);
exports.default = new (class GuildMemberAddHandler {
  constructor(
    memberLogger = Deps_1.default.get(MemberClearance_Shield_1.default),
    nicknameFiltering = Deps_1.default.get(NicknameFiltering_Shield_1.default),
    client = Deps_1.default.get(discord_js_1.Client)
  ) {
    this.memberLogger = memberLogger;
    this.nicknameFiltering = nicknameFiltering;
    this.client = client;
    this.on = "guildMemberAdd";
    this.type = 2;
    this.invoke = (member) =>
      __awaiter(this, void 0, void 0, function* () {
        yield this.memberLogger.init(member);
        yield this.nicknameFiltering.init(member).catch(() => {});
      });
  }
})();
