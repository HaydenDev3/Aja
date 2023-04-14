import { Activity, ActivityType, PresenceData } from "discord.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import emojisData from "./emojis.json";

export interface Config {
  port: any;
  discord: {
    token: string;
    ownerIds: string[];
    supportServerURL: string /** @INFO - Replace with your Bot(s) discord support server URL */;
    messages: PresenceData | any; // For the presence revolver... ;-;
    clientID: string;
    clientSecret: string;
    callbackUrl: string;
    feedbackChannelId: string;
    guildLogsChannelId: string;
  };
  api: {
    sessionSecret: string;
    url: string;
    dashboard: string;
  };
  database: {
    uri: string;
    options: {};
  };
  emojis: any;
}

const config: Config = {
  port: process.env.PORT ?? 3000,
  discord: {
    token: process.env.BOT_TOKEN as string,
    supportServerURL: "https://discord.gg/xhRjfchkHS",
    ownerIds: [
      "622903645268344835",
    ] /** @INFO - Replace with your ID // and other peoples ID(s) */,
    messages: {
      activities: [
        {
          name: "Coming Soon - aja.haydenf.cloud",
          type: ActivityType.Playing,
        },
        {
          name: "I am in development - Estiminated Release Date is 2nd or 16th of April.",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud/",
        },
        {
          name: "“The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.” - Helen Keller",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“It does not matter how slowly you go as long as you do not stop.” - Confucius",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“The only way to do great work is to love what you do.” - Steve Jobs",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“The only limit to our realization of tomorrow will be our doubts of today.” - Franklin D. Roosevelt",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“Happiness is not something ready made. It comes from your own actions.” - Dalai Lama",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“Believe you can and you're halfway there.” - Theodore Roosevelt",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“Success is not final, failure is not fatal: It is the courage to continue that counts.” - Winston Churchill",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“The best revenge is massive success.” - Frank Sinatra",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“I can't change the direction of the wind, but I can adjust my sails to always reach my destination.” - Jimmy Dean",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
        {
          name: "“Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.” - Albert Schweitzer",
          type: ActivityType.Streaming,
          url: "https://aja.haydenf.cloud",
        },
      ],
    },
    callbackUrl: `http://localhost:1000/auth/discord/callback`,
    clientID: "994930207918129182",
    clientSecret: process.env!.clientSecret as string,
    feedbackChannelId: "1096312799627587635",
    guildLogsChannelId: "1086484073800794274",
  },
  api: {
    url: "http://localhost:1000",
    sessionSecret: "DEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ123465789",
    dashboard: "http://localhost:3000",
  },
  database: {
    uri: process.env.MONGOOSE_ATLAS ?? "mongodb://localhost:27017/Aja",
    options: {},
  },
  emojis: emojisData as unknown as Record<string, string>,
};

export default config;
