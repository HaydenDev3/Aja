import { Client, ClientEvents, GuildMember } from "discord.js";
import Deps from "../../utils/Deps";
import { EventType, IEvent } from "../events.service";
import MemberClearanceLog from "../modules/MemberClearance.Shield";
import NicknameFiltering from "../modules/NicknameFiltering.Shield";

export default new (class GuildMemberAddHandler implements IEvent {
  on: keyof ClientEvents = "guildMemberAdd";
  type: EventType = 2;

  constructor(
    private memberLogger: MemberClearanceLog = Deps.get<MemberClearanceLog>(
      MemberClearanceLog
    ),
    private nicknameFiltering: NicknameFiltering = Deps.get<NicknameFiltering>(
      NicknameFiltering
    ),
    private client: Client = Deps.get<Client>(Client)
  ) {}

  invoke = async (member: GuildMember) => {
    await this.memberLogger.init(member);
    await this.nicknameFiltering.init(member).catch(() => {});
  };
})();
