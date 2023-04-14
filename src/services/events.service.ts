import { ClientEvents } from 'discord.js';
import mongoose, { connect, Connection } from 'mongoose';
import config from '../utils/Config';
import Log from '../utils/Log';
import RegisteringService from './registering.service';

export type EventType =
  | 1 // 1 = mongoose
  | 2; // 2 = discord event

export interface IEvent {
  on?: string | keyof ClientEvents;
  type: EventType;
  invoke: (...args: any[]) => Promise<any> | void;
}

export default class EventsRegistery extends RegisteringService {
  private handlers: IEvent[] = [];

  constructor() {
    super();

    config.database.uri, config.database.options;
    return this;
  }

  public async init() {
    const events = await this.readdir(`${__dirname}/events`);

    for (const file of events.filter((file) => file.endsWith('.ts'))) {
      const handler = await this.importFile(`./events/${file}`);
      if (!handler) return;

      if (handler.type === 1) {
        if (mongoose.connection) {
          mongoose.connection.on(
            handler.on as any,
            handler.invoke.bind(handler)
          );
        } else if (handler.type === 2) {
          Log.warn(
            `Skipping "${handler.on}" event handler as there is no Mongoose connection.`,
            'handlers'
          );
        }
      } else {
        this.client.on(handler.on as any, handler.invoke.bind(handler));
        this.handlers.push(handler);
      }
    }

    Log.info(`Loaded: ${this.handlers.length} handlers.`, 'handlers');
  }
}
