import Log from '../../utils/Log';
import { EventType, IEvent } from '../events.service';

export default new (class MongooseConnectedHandler implements IEvent {
  on = 'connected';
  type: EventType = 1;

  invoke = () => {
    Log.info(`Database connection established.`, 'database');
  };
})();
