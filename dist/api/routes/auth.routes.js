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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const AuthUser_1 = __importDefault(require("../../database/models/AuthUser"));
const Config_1 = __importDefault(require("../../utils/Config"));
exports.router = express_1.default.Router();
exports.router.get("/", (req, res) =>
  res.status(200).json({
    code: res.statusCode,
    message:
      "There are 3 routes existing:\n/auth/discord\n/auth/discord/callback\n/auth/user",
  })
);
exports.router.get("/discord", passport_1.default.authenticate("discord"));
exports.router.get(
  "/discord/callback",
  passport_1.default.authenticate("discord", { failureRedirect: "/login" }),
  (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _a, _b;
      try {
        const { id, username, discriminator } = req.user;
        const guilds =
          (_b =
            (_a = req.user) === null || _a === void 0 ? void 0 : _a.guilds) ===
            null || _b === void 0
            ? void 0
            : _b.map((guild) => ({
                id: guild.id,
                name: guild.name,
                permissions: guild.permissions,
              }));
        // find or create user in database
        const user = yield AuthUser_1.default.findOneAndUpdate(
          { discordId: id },
          { username, discriminator, guilds },
          { upsert: true, new: true }
        );
        // set user in session
        req.user = user;
        // redirect to dashboard
        res.redirect(`${Config_1.default.api.dashboard}/dashboard`);
      } catch (err) {
        console.error(err);
        res.redirect("/error");
      }
    })
);
exports.router.get("/user", (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Not authenticated" });
  }
  return res.send(req.user);
});
