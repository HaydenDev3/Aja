"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const Config_1 = __importDefault(require("../utils/Config"));
const AuthUser_1 = __importDefault(require("../database/models/AuthUser"));
const index_routes_1 = require("./routes/index.routes");
const Log_1 = __importDefault(require("../utils/Log"));
const passport_discord_1 = require("passport-discord");
const connect_mongodb_session_1 = __importDefault(
  require("connect-mongodb-session")
);
const app = (0, express_1.default)();
const MongoDBStore = (0, connect_mongodb_session_1.default)(
  express_session_1.default
);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(
  (0, express_session_1.default)({
    secret: Config_1.default.discord.clientSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri: Config_1.default.database.uri,
      collection: "sessions",
    }),
  })
);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(
  new passport_discord_1.Strategy(
    {
      clientID: Config_1.default.discord.clientID,
      clientSecret: Config_1.default.discord.clientSecret,
      callbackURL: `${Config_1.default.api.url}/auth/discord/callback`,
      scope: ["identify", "guilds"],
      passReqToCallback: true,
    },
    (accessToken, refreshToken, profile, done) =>
      __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
          const existingUser = yield AuthUser_1.default.findOne({
            discordId: profile.id,
          });
          if (existingUser) {
            return done(null, existingUser);
          }
          const newUser = new AuthUser_1.default({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar,
            guilds:
              (_a = profile.guilds) === null || _a === void 0
                ? void 0
                : _a.map((guild) => ({
                    id: guild.id,
                    name: guild.name,
                  })),
          });
          yield newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err);
        }
      })
  )
);
passport_1.default.serializeUser((user, done) => {
  done(null, user._id);
});
passport_1.default.deserializeUser((id, done) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield AuthUser_1.default.findOne({ _id: id }).then((user) => {
      done(null, user);
    });
  })
);
app.use("/api", index_routes_1.router);
app.listen(1000, () =>
  Log_1.default.info("Server is live with port 1000", "api")
);
