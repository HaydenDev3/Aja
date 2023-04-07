import axios from "axios";

/**
 * Pings the specified URL at the given interval to keep the app alive.
 * @param url The URL of the application to keep alive.
 * @param interval The interval, in milliseconds, at which to ping the application.
 */

function keepAlive(replitUrl: string) {
  setInterval(async () => {
    await axios.get(replitUrl);

    console.log("App is being kept alive!");
  }, 120000); // pings every 5 minutes
}

export default keepAlive;
