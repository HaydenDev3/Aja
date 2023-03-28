import { Error } from "mongoose";
import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";

export default new (class MongooseConnectedHandler implements IEvent {
  on = "error";
  type: EventType = 1;

  invoke = (error: Error) => {
    Log.info(`Database Error:\n${error.stack}`, "database");
  };
})();
