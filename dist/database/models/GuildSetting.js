"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSettings =
  exports.guildSettingsSchema =
  exports.RaidShieldModule =
  exports.MessageFilteringSettings =
  exports.MemberClearanceModule =
  exports.TicketingModule =
  exports.WelcomingSettings =
  exports.NicknameFiltering =
  exports.OnboardingModule =
  exports.GeneralModule =
  exports.LeavingSettings =
  exports.AntiSpamSettings =
  exports.Module =
    void 0;
const mongoose_1 = __importStar(require("mongoose"));
class Module {
  constructor() {
    this.enabled = false;
  }
}
exports.Module = Module;
class AntiSpamSettings extends Module {
  constructor() {
    super(...arguments);
    this.warnThreshold = 0;
    this.kickThreshold = 0;
    this.banThreshold = 0;
    this.warningMessage = "";
    this.kickMessage = "";
    this.banMessage = "";
    this.exemptRoles = [];
    this.exemptMembers = [];
  }
}
exports.AntiSpamSettings = AntiSpamSettings;
class LeavingSettings extends Module {
  constructor() {
    super(...arguments);
    this.message = "";
    this.embed = false;
  }
}
exports.LeavingSettings = LeavingSettings;
class GeneralModule extends Module {
  constructor() {
    super(...arguments);
    this.prefix = "!";
    this.holdRoleId = "";
    this.logChannelId = "";
  }
}
exports.GeneralModule = GeneralModule;
class OnboardingModule extends Module {
  constructor() {
    super(...arguments);
    this.channel = "";
    this.embeds = [];
    this.components = [];
  }
}
exports.OnboardingModule = OnboardingModule;
class NicknameFiltering extends Module {
  constructor() {
    super(...arguments);
    this.logChannel = "";
    this.action = [];
    this.filtered = [];
  }
}
exports.NicknameFiltering = NicknameFiltering;
class WelcomingSettings extends Module {
  constructor() {
    super(...arguments);
    this.message = "";
    this.channel = "";
    this.verification = {
      channel: "",
      memberRole: "",
    };
    this.nicknameFiltering = {
      enabled: false,
      logChannel: "",
      action: ["warn", "modify"],
      filtered: ["fuck", "nigga", "pussy", "vagiana", "cock", "dick"],
    };
    this.embed = false;
  }
}
exports.WelcomingSettings = WelcomingSettings;
class TicketingModule extends Module {
  constructor() {
    super(...arguments);
    this.transcriptChannel = "";
    this.supportRoles = [];
    this.tickets = new Map();
  }
}
exports.TicketingModule = TicketingModule;
class MemberClearanceModule extends Module {
  constructor() {
    super(...arguments);
    this.logChannel = "";
    this.memberRole = "";
    this.botRole = "";
    this.actions = [];
  }
}
exports.MemberClearanceModule = MemberClearanceModule;
class MessageFilteringSettings extends Module {
  constructor() {
    super(...arguments);
    this.bannedWords = [];
    this.bannedLinks = [];
    this.warnThreshold = 0;
    this.kickThreshold = 0;
    this.banThreshold = 0;
    this.warningMessage =
      "Please refrain from using inappropriate language or links.";
    this.kickMessage = "User kicked for using inappropriate language or links.";
    this.banMessage = "User kicked for using inappropriate language or links.";
    this.action = "warn";
    this.exemptRoles = [];
    this.exemptMembers = [];
  }
}
exports.MessageFilteringSettings = MessageFilteringSettings;
class RaidShieldModule extends Module {
  constructor() {
    super(...arguments);
    this.logChannel = "";
    this.action = [];
    this.warnThreshold = 0;
    this.kickThreshold = 0;
    this.banThreshold = 0;
  }
}
exports.RaidShieldModule = RaidShieldModule;
exports.guildSettingsSchema = new mongoose_1.Schema({
  _id: { type: String, required: true },
  general: { type: Object, default: new GeneralModule() },
  antiSpam: { type: Object, default: new AntiSpamSettings() },
  welcoming: { type: Object, default: new AntiSpamSettings() },
  leaving: { type: Object, default: new LeavingSettings() },
  messageFiltering: { type: Object, default: new MessageFilteringSettings() },
  onboarding: { type: Object, default: new OnboardingModule() },
  raidShield: { type: Object, default: new RaidShieldModule() },
  ticketing: { type: Object, default: new TicketingModule() },
});
exports.GuildSettings = mongoose_1.default.model(
  "guilds",
  exports.guildSettingsSchema
);
