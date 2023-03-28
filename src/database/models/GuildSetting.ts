import {
  ActionRowBuilder,
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  EmbedBuilder,
  Guild,
  GuildMember,
  Role,
  TextChannel,
} from "discord.js";
import mongoose, { Schema, Document } from "mongoose";

export class Module {
  enabled: boolean = false;
}

export class SpamShield extends Module {
  warnThreshold: number = 0;
  kickThreshold: number = 0;
  banThreshold: number = 0;
  warningMessage: string = "";
  kickMessage: string = "";
  banMessage: string = "";
  exemptRoles: string[] = [];
  exemptMembers: string[] = [];
}

export class LeavingSettings extends Module {
  channel: string = "";
  message: string = "";
  embed?: boolean = false;
}

export class GeneralModule extends Module {
  enabled: boolean = true;
  prefix: string = "!";
  holdRoleId: string = "";
}

export class OnboardingModule extends Module {
  embeds: APIEmbed[] = [];
  components: Array<ActionRowBuilder> = [];
}

export type Action = "ban" | "kick" | "warn" | "delete" | "modify" | "timeout";

export class NicknameFiltering extends Module {
  action: Action[] = [];
  filtered: Array<string> = [];
}

export class WelcomingSettings extends Module {
  message: string = "";
  channel: string = "";
  verification: {
    channel: string;
    memberRole: string;
  } = {
    channel: "",
    memberRole: "",
  };
  onboarding: OnboardingModule = new OnboardingModule();
  embed?: boolean = false;
}

export interface ITicket {
  guild: Guild;
  channel: TextChannel;
  author: GuildMember;
  open: boolean;
}

export class TicketingModule extends Module {
  transcriptChannel: string = "";
  supportRoles: Role[] = [];
  tickets: Map<string, ITicket> = new Map();
}

export class MemberRiskLogging extends Module {
  memberRole: string = "";
  botRole: string = "";
  actions: Action[] = [];
}

export class MessageFilteringSettings extends Module {
  bannedWords: string[] = [];
  bannedLinks: string[] = [];
  warnThreshold: number = 0;
  kickThreshold: number = 0;
  banThreshold: number = 0;
  warningMessage: string =
    "Please refrain from using inappropriate language or links.";
  kickMessage: string =
    "User kicked for using inappropriate language or links.";
  banMessage: string = "User kicked for using inappropriate language or links.";
  action: Action = "warn";
  exemptRoles: string[] = [];
  exemptMembers: string[] = [];
}

export class RaidShieldModule extends Module {
  action: Action[] = [];
  warnThreshold: number = 0;
  kickThreshold: number = 0;
  banThreshold: number = 0;
}

export class LoggingModule extends Module {
  channel: string = "";
  welcoming: WelcomingSettings = new WelcomingSettings();
  leaving: LeavingSettings = new LeavingSettings();
  memberRiskLogging: MemberRiskLogging = new MemberRiskLogging();
}

export class ContentFiltering extends Module {
  channel: string = "";
  messageFiltering: MessageFilteringSettings = new MessageFilteringSettings();
  nicknameFiltering: NicknameFiltering = new NicknameFiltering();
}

export class Shields extends Module {
  channel: string = "";
  spamShield: SpamShield = new SpamShield();
  raidShield: RaidShieldModule = new RaidShieldModule();
}

export interface GuildSettingsDocument extends Document {
  general: GeneralModule;
  logging: LoggingModule;
  ticketing: TicketingModule;
  contentFiltering: ContentFiltering;
  shields: Shields;
}

export const guildSettingsSchema = new Schema<GuildSettingsDocument>({
  _id: { type: String, required: true },
  general: { type: Object, default: new GeneralModule() },
  shields: { type: Object, default: new Shields() },
  logging: { type: Object, default: new LoggingModule() },
  contentFiltering: { type: Object, default: new ContentFiltering() },
  ticketing: { type: Object, default: new TicketingModule() },
});

export const GuildSettings = mongoose.model<GuildSettingsDocument>(
  "guilds",
  guildSettingsSchema
);
