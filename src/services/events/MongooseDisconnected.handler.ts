import Log from "../../utils/Log";
import { EventType, IEvent } from "../events.service";

export default new (class MongooseDisconnectedHandler implements IEvent {
  on = "disconnected";
  type: EventType = 1;

  invoke = () => {
    Log.info(`Database disconnected.`, "database");
  };
})();
