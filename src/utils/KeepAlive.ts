import fetch from "node-fetch";

/**
 * Pings the specified URL at the given interval to keep the app alive.
 * @param url The URL of the application to keep alive.
 * @param interval The interval, in milliseconds, at which to ping the application.
 */
export async function keepAlive(url: string, interval: number): Promise<void> {
  if (!url || typeof interval !== "number" || interval < 1000) {
    throw new Error("Invalid arguments provided to keepAlive function.");
  }

  setInterval(async () => {
    try {
      const res = await fetch(url);
      console.log(`[Keep Alive] Status: ${res.status}`);
    } catch (err) {
      console.error(`[Keep Alive] Error: ${err}`);
    }
  }, interval);
}