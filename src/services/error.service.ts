import config from "../utils/Config";
import Deps from "../utils/Deps";
import Log from "../utils/Log";
import RegisteringService from "./registering.service";

class AntiCrashService extends RegisteringService {
  public start(): void {
    process.on("uncaughtException", this.handleUncaughtException);
    process.on("unhandledRejection", this.handleUnhandledRejection);
  }

  public stop(): void {
    process.off("uncaughtException", this.handleUncaughtException);
    process.off("unhandledRejection", this.handleUnhandledRejection);
  }

  private handleUncaughtException = (error: Error, origin: string): void => {
    Log.fail(`Uncaught Exception:\n${error}\nOrigin: ${origin}`);
  };

  private handleUnhandledRejection = (
    reason: any,
    promise: Promise<any>
  ): void => {
    Log.fail(`Unhandled Rejection:\n${reason}`);
  };
}

export default AntiCrashService;
