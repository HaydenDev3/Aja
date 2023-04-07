import {
  ActionRowBuilder,
  APIEmbed,
  Guild,
  GuildMember,
  Role,
  TextChannel,
} from "discord.js";
import mongoose, { Schema, Document } from "mongoose";
import { Action } from "../Action";
export class Module {
  enabled: boolean;

  constructor(enabled = false) {
    this.enabled = enabled;
  }
}

export class StickyMessage extends Module {
  message: string;
  channelId: string;
  messageId: string;
  buttons: { label: string; url?: string; embed?: APIEmbed }[];

  constructor() {
    super();
    this.message = "";
    this.channelId = "";
    this.messageId = "";
    this.buttons = [];
  }
}

export class SpamShield extends Module {
  warnThreshold: number;
  kickThreshold: number;
  banThreshold: number;
  warningMessage: string;
  kickMessage: string;
  banMessage: string;
  exemptRoles: string[];
  exemptMembers: string[];

  constructor() {
    super();
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

export class LeavingSettings extends Module {
  channel: string;
  message: string;
  embed: boolean;

  constructor() {
    super();
    this.channel = "";
    this.message = "";
    this.embed = false;
  }
}

export class GeneralModule extends Module {
  prefix: string;
  holdRoleId: string;

  constructor() {
    super(true);
    this.prefix = "!";
    this.holdRoleId = "";
  }
}

export class OnboardingModule {
  embeds: APIEmbed[];
  components: ActionRowBuilder[];

  constructor() {
    this.embeds = [];
    this.components = [];
  }
}

export class NicknameFiltering extends Module {
  action: Action[];
  filtered: string[];

  constructor() {
    super();
    this.action = [];
    this.filtered = [];
  }
}

export class VerificationSettings extends Module {
  channel: string; 
  memberRole: string;

  constructor () {
    super();

    this.channel = "";
    this.memberRole = "";
  }
}

export class WelcomingSettings extends Module {
  message: string;
  channel: string;
  verification: VerificationSettings;
  onboarding: OnboardingModule;
  embed: boolean;

  constructor() {
    super();
    this.message = "";
    this.channel = "";
    this.verification = new VerificationSettings();
    this.onboarding = new OnboardingModule();
    this.embed = false;
  }
}

export interface ITicket {
  guild: Guild;
  channel: TextChannel;
  author: GuildMember;
  open: boolean;
}

export class TicketingModule extends Module {
  transcriptChannel: string;
  supportRoles: Role[];
  tickets: Map<string, ITicket>;

  constructor() {
    super();
    this.transcriptChannel = "";
    this.supportRoles = [];
    this.tickets = new Map();
  }
}

export class MemberRiskLogging extends Module {
  memberRole: string;
  botRole: string;
  actions: Action[];

  constructor() {
    super();
    this.memberRole = "";
    this.botRole = "";
    this.actions = [];
  }
}

export class MessageFilteringSettings extends Module {
  bannedWords: string[] = [];
  bannedLinks: string[] = [];
  warnThreshold = 0;
  kickThreshold = 0;
  banThreshold = 0;
  warningMessage = "Please refrain from using inappropriate language or links.";
  kickMessage = "User kicked for using inappropriate language or links.";
  banMessage = "User kicked for using inappropriate language or links.";
  action: Action = "warn";
  exemptRoles: string[] = [];
  exemptMembers: string[] = [];
}

export class RaidShieldModule extends Module {
  action: Action[] = [];
  warnThreshold = 0;
  kickThreshold = 0;
  banThreshold = 0;
}

export class LoggingModule extends Module {
  channel = "";
  welcoming = new WelcomingSettings();
  leaving = new LeavingSettings();
  memberRiskLogging = new MemberRiskLogging();
}

export class ContentFiltering extends Module {
  channel = "";
  messageFiltering = new MessageFilteringSettings();
  nicknameFiltering = new NicknameFiltering();
}

export class Shields extends Module {
  channel = "";
  spamShield = new SpamShield();
  raidShield = new RaidShieldModule();
}

export interface GuildSettingsDocument extends Document {
  general: GeneralModule;
  logging: LoggingModule;
  ticketing: TicketingModule;
  contentFiltering: ContentFiltering;
  shields: Shields;
  stickyMessages: StickyMessage[];
}

export const guildSettingsSchema = new Schema<GuildSettingsDocument>({
  _id: { type: String, required: true },
  general: { type: Object, default: new GeneralModule() },
  shields: { type: Object, default: new Shields() },
  logging: { type: Object, default: new LoggingModule() },
  contentFiltering: { type: Object, default: new ContentFiltering() },
  ticketing: { type: Object, default: new TicketingModule() },
  stickyMessages: [{ type: Object, default: new StickyMessage() }],
});

export const GuildSettings = mongoose.model<GuildSettingsDocument>(
  "guilds",
  guildSettingsSchema
);
