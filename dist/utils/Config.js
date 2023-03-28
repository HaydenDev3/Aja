"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const emojis_json_1 = __importDefault(require("./emojis.json"));
const config = {
  port: (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000,
  discord: {
    token: process.env.BOT_TOKEN,
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
    clientSecret: "EDGtiwH9wJG8uGvC8KeGMlY6e18Nk-IR",
  },
  api: {
    url: "http://localhost:1000/api",
    sessionSecret: "DEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ123465789",
    dashboard: "http://localhost:3000",
  },
  database: {
    uri:
      (_b = process.env.MONGOOSE_ATLAS) !== null && _b !== void 0
        ? _b
        : "mongodb://localhost:27017/Aja",
    options: {},
  },
  emojis: emojis_json_1.default,
};
exports.default = config;
