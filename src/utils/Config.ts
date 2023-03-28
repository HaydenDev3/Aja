import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import emojisData from "./emojis.json";

export interface Config {
  port: any;
  discord: {
    token: string;
    ownerIds: string[];
    messages: string[]; // For the presence revolver... ;-;
    clientID: string;
    clientSecret: string;
    callbackUrl: string;
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
    ownerIds: ["622903645268344835"],
    messages: [
      "Coming Soon - aja.haydenf.cloud",
      "I am in development - Estiminated Release Date is 2nd or 16th of April.",
      "“The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.” - Helen Keller",
      "“It does not matter how slowly you go as long as you do not stop.” - Confucius",
      "“The only way to do great work is to love what you do.” - Steve Jobs",
      "“The only limit to our realization of tomorrow will be our doubts of today.” - Franklin D. Roosevelt",
      "“Believe you can and you're halfway there.” - Theodore Roosevelt",
      "“Happiness is not something ready made. It comes from your own actions.” - Dalai Lama",
      "“Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.” - Albert Schweitzer",
      "“The best revenge is massive success.” - Frank Sinatra",
      "“Success is not final, failure is not fatal: It is the courage to continue that counts.” - Winston Churchill",
      "“I can't change the direction of the wind, but I can adjust my sails to always reach my destination.” - Jimmy Dean",
    ],
    callbackUrl: `http://localhost:3000/api/auth/callback`,
    clientID: "994930207918129182",
    clientSecret: process.env!.clientSecret as string,
  },
  api: {
    url: "http://localhost:1000/api",
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