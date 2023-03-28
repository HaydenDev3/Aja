import "colors";
import {
  Client,
  Colors,
  EmbedBuilder,
  TextChannel,
  User,
  WebhookClient,
} from "discord.js";
import Command from "../commands/Command";
import SlashCommand from "../commands/SlashCommand";
import Deps from "./Deps";

export default class Log {
  private static formatTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  private static getSource(src?: string) {
    return src?.toUpperCase() || "BOT";
  }

  // https://discord.com/api/webhooks//
  static info(message: string, src?: string) {
    setTimeout(async () => {
      let webhook = new WebhookClient({
        url: "https://discord.com/api/webhooks/1086566517719715900/XtZivGTDzdO23E0X_B7qPVmiSRJtPHuxA2M_XjQpo9YVz7cFac01jQgiOJcY0nid7jvL",
        token:
          "XtZivGTDzdO23E0X_B7qPVmiSRJtPHuxA2M_XjQpo9YVz7cFac01jQgiOJcY0nid7jvL",
        id: "1086566517719715900",
      });

      const embed = new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setDescription(
          `> [${this.formatTime(new Date())}] LAUNCHER [\`${this.getSource(
            src
          )}\`] ${message}`
        );
      await webhook.send({ embeds: [embed] });
    }, 10000);

    return console.log(
      String(
        `[${this.formatTime(new Date())}] LAUNCHER [${this.getSource(
          src
        )}] ${message}`
      ).blue.bold
    );
  }

  static database(message: string, src?: string) {
    setTimeout(async () => {
      let webhook = new WebhookClient({
        url: "https://discord.com/api/webhooks/1086564665200484462/RKSe4YI9HnoTokTWB8NeUlznEbHP8wF685hJdeqZMu0pqBfDyD9E0YLbGAWZQbjzKppV",
        token:
          "RKSe4YI9HnoTokTWB8NeUlznEbHP8wF685hJdeqZMu0pqBfDyD9E0YLbGAWZQbjzKppV",
        id: "1086564665200484462",
      });
      const embed = new EmbedBuilder()
        .setColor(Colors.Blurple)
        .setDescription(
          `> [${this.formatTime(new Date())}] DATABASE [\`${this.getSource(
            src
          )}\`] ${message}`
        );
      await webhook.send({ embeds: [embed] });
    }, 2000);
  }

  static command(
    command: Command | any,
    author: User,
    isSlashCommand?: boolean
  ) {
    setTimeout(async () => {
      let webhook = new WebhookClient({
        url: "https://discord.com/api/webhooks/1086565098245603368/_RgILiIiDT-mhX-Tv8dqBwwtLZSwG8xqI3fqtsU22S1pcj8SPlZHIZ-z07Pd58g8G6H1",
        token:
          "_RgILiIiDT-mhX-Tv8dqBwwtLZSwG8xqI3fqtsU22S1pcj8SPlZHIZ-z07Pd58g8G6H1",
        id: "1086565098245603368",
      });
      const embed = new EmbedBuilder()
        .setTitle(`Command Logged`)
        .setColor(Colors.Blurple)
        .setDescription(
          `> ${
            isSlashCommand ? "<:slashCommandIcon:1086196240208891944> " : ""
          }\`${command.data?.name}\` was executed by \`${author.tag}\``
        );
      await webhook.send({ embeds: [embed] });
    }, 2000);
  }

  static fail(error: any, src?: string) {
    try {
      setTimeout(async () => {
        let webhook = new WebhookClient({
          url: "https://discord.com/api/webhooks/1086565610919579758/NoFZg_DLijtTvC0bKeofQ1TBUwltslstKWaikPbf-JBBqFnYDw1pEuj19nnsiatGi2ch",
          token:
            "NoFZg_DLijtTvC0bKeofQ1TBUwltslstKWaikPbf-JBBqFnYDw1pEuj19nnsiatGi2ch",
          id: "1086565610919579758",
        });
        const embed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setDescription(
            `> [${this.formatTime(
              new Date()
            )}] FAILED LAUNCH [\`${this.getSource(src)}\`] ${
              error.message || error || "unknown error"
            }`
          );
        await webhook.send({ embeds: [embed] });
      }, 5000);
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

  static success(message: any, src?: string) {
    return console.log(
      String(
        `[${this.formatTime(new Date())}] SUCCESSFULL [${this.getSource(
          src
        )}] ${message}`
      ).green.bold
    );
  }

  static warn(message: any, src?: string) {
    return console.log(
      String(
        `[${this.formatTime(new Date())}] WARNING [${this.getSource(
          src
        )}] ${message}`
      ).yellow.bold
    );
  }
}
