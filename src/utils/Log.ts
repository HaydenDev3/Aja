import 'colors';

export default class Log {
  private static formatTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  private static getSource(src?: string) {
    return src?.toUpperCase() || 'BOT';
  }

  static info(message: string, src?: string) {
    return console.log(
      String(
        `[${this.formatTime(new Date())}] LAUNCHER [${this.getSource(
          src
        )}] ${message}`
      ).blue.bold
    );
  }

  static fail(error: any, src?: string) {
    return console.log(
      String(
        `[${this.formatTime(new Date())}] FAILED LAUNCH [${this.getSource(
          src
        )}] ${error.message || error || 'unknown error'}`
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
