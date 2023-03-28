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
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const discord_js_1 = require("discord.js");
class Log {
  static formatTime(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  static getSource(src) {
    return (
      (src === null || src === void 0 ? void 0 : src.toUpperCase()) || "BOT"
    );
  }
  // https://discord.com/api/webhooks//
  static info(message, src) {
    setTimeout(
      () =>
        __awaiter(this, void 0, void 0, function* () {
          let webhook = new discord_js_1.WebhookClient({
            url: "https://discord.com/api/webhooks/1086566517719715900/XtZivGTDzdO23E0X_B7qPVmiSRJtPHuxA2M_XjQpo9YVz7cFac01jQgiOJcY0nid7jvL",
            token:
              "XtZivGTDzdO23E0X_B7qPVmiSRJtPHuxA2M_XjQpo9YVz7cFac01jQgiOJcY0nid7jvL",
            id: "1086566517719715900",
          });
          const embed = new discord_js_1.EmbedBuilder()
            .setColor(discord_js_1.Colors.Blurple)
            .setDescription(
              `> [${this.formatTime(new Date())}] LAUNCHER [\`${this.getSource(
                src
              )}\`] ${message}`
            );
          yield webhook.send({ embeds: [embed] });
        }),
      10000
    );
    return console.log(
      String(
        `[${this.formatTime(new Date())}] LAUNCHER [${this.getSource(
          src
        )}] ${message}`
      ).blue.bold
    );
  }
  static database(message, src) {
    setTimeout(
      () =>
        __awaiter(this, void 0, void 0, function* () {
          let webhook = new discord_js_1.WebhookClient({
            url: "https://discord.com/api/webhooks/1086564665200484462/RKSe4YI9HnoTokTWB8NeUlznEbHP8wF685hJdeqZMu0pqBfDyD9E0YLbGAWZQbjzKppV",
            token:
              "RKSe4YI9HnoTokTWB8NeUlznEbHP8wF685hJdeqZMu0pqBfDyD9E0YLbGAWZQbjzKppV",
            id: "1086564665200484462",
          });
          const embed = new discord_js_1.EmbedBuilder()
            .setColor(discord_js_1.Colors.Blurple)
            .setDescription(
              `> [${this.formatTime(new Date())}] DATABASE [\`${this.getSource(
                src
              )}\`] ${message}`
            );
          yield webhook.send({ embeds: [embed] });
        }),
      2000
    );
  }
  static command(command, author, isSlashCommand) {
    setTimeout(
      () =>
        __awaiter(this, void 0, void 0, function* () {
          var _a;
          let webhook = new discord_js_1.WebhookClient({
            url: "https://discord.com/api/webhooks/1086565098245603368/_RgILiIiDT-mhX-Tv8dqBwwtLZSwG8xqI3fqtsU22S1pcj8SPlZHIZ-z07Pd58g8G6H1",
            token:
              "_RgILiIiDT-mhX-Tv8dqBwwtLZSwG8xqI3fqtsU22S1pcj8SPlZHIZ-z07Pd58g8G6H1",
            id: "1086565098245603368",
          });
          const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Command Logged`)
            .setColor(discord_js_1.Colors.Blurple)
            .setDescription(
              `> ${
                isSlashCommand ? "<:slashCommandIcon:1086196240208891944> " : ""
              }\`${
                (_a = command.data) === null || _a === void 0 ? void 0 : _a.name
              }\` was executed by \`${author.tag}\``
            );
          yield webhook.send({ embeds: [embed] });
        }),
      2000
    );
  }
  static fail(error, src) {
    try {
      setTimeout(
        () =>
          __awaiter(this, void 0, void 0, function* () {
            let webhook = new discord_js_1.WebhookClient({
              url: "https://discord.com/api/webhooks/1086565610919579758/NoFZg_DLijtTvC0bKeofQ1TBUwltslstKWaikPbf-JBBqFnYDw1pEuj19nnsiatGi2ch",
              token:
                "NoFZg_DLijtTvC0bKeofQ1TBUwltslstKWaikPbf-JBBqFnYDw1pEuj19nnsiatGi2ch",
              id: "1086565610919579758",
            });
            const embed = new discord_js_1.EmbedBuilder()
              .setColor(discord_js_1.Colors.Red)
              .setDescription(
                `> [${this.formatTime(
                  new Date()
                )}] FAILED LAUNCH [\`${this.getSource(src)}\`] ${
                  error.message || error || "unknown error"
                }`
              );
            yield webhook.send({ embeds: [embed] });
          }),
        5000
      );
    } catch (err) {
      console.error(err);
    }
    return console.log(
      String(
        `[${this.formatTime(new Date())}] FAILED LAUNCH [${this.getSource(
          src
        )}] ${error.message || error || "unknown error"}`
      ).grey.bgRed.bold
    );
  }
  static success(message, src) {
    return console.log(
      String(
        `[${this.formatTime(new Date())}] SUCCESSFULL [${this.getSource(
          src
        )}] ${message}`
      ).green.bold
    );
  }
  static warn(message, src) {
    return console.log(
      String(
        `[${this.formatTime(new Date())}] WARNING [${this.getSource(
          src
        )}] ${message}`
      ).yellow.bold
    );
  }
}
exports.default = Log;
