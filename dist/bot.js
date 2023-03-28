"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const Deps_1 = __importDefault(require("./utils/Deps"));
const Log_1 = __importDefault(require("./utils/Log"));
const Config_1 = __importDefault(require("./utils/Config"));
const events_service_1 = __importDefault(require("./services/events.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_service_1 = __importDefault(require("./services/error.service"));
exports.client = Deps_1.default.add(
  discord_js_1.Client,
  new discord_js_1.Client({
    intents: [
      discord_js_1.GatewayIntentBits.Guilds,
      discord_js_1.GatewayIntentBits.GuildIntegrations,
      discord_js_1.GatewayIntentBits.MessageContent,
      discord_js_1.GatewayIntentBits.GuildMessages,
    ],
  })
);
mongoose_1.default.connect(
  Config_1.default.database.uri,
  Config_1.default.database.options
);
mongoose_1.default.connection.on("connect", () =>
  Log_1.default.database("Connected to db stable", "db")
);
mongoose_1.default.connection.on("disconnect", () =>
  Log_1.default.database("Disconnected from db", "db")
);
mongoose_1.default.connection.on("reconnecting", () =>
  Log_1.default.database("Reconnecting to db", "db")
);
mongoose_1.default.connection.on("error", (error) =>
  Log_1.default.database(`Failed to connect to db:\n${error}`, "db")
);
Deps_1.default.get(error_service_1.default).start();
Deps_1.default.get(events_service_1.default).init();
exports.client.login(Config_1.default.discord.token);
/** @INFO - Opening server */
require("./api/app");
