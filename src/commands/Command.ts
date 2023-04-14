import { PermissionFlags, PermissionsString } from 'discord.js';

export type Permission = PermissionFlags | PermissionsString;

export interface MessageCommandData {
  name: string;
  summary?: string;
  permissions?: Permission[];
  cooldown?: number;
  aliases?: string[];
}

export default interface Command {
  data: MessageCommandData;
  invoke: (...args: any[]) => Promise<any> | void;
}
