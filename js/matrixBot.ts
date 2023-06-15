
import { MatrixAuth, MatrixClient, AutojoinRoomsMixin, SimpleFsStorageProvider, RustSdkCryptoStorageProvider } from "matrix-bot-sdk";
import { initHandler } from "./handlers/index";
import { config } from "dotenv";
config();

export function initMatrixBot() : MatrixClient {
  // This will be the URL where clients can reach your homeserver. Note that this might be different
  // from where the web/chat interface is hosted. The server must support password registration without
  // captcha or terms of service (public servers typically won't work).
  const homeserverUrl = process.env.HOST_SERVER;

  // const client = await auth.passwordLogin("renji-bot", "password");
  const token = process.env.ACCESS_TOKEN;

  const storage = new SimpleFsStorageProvider("gpn-bot.json");
  const cryptoProvider = new RustSdkCryptoStorageProvider("gpn-bot-crypto");

  const client = new MatrixClient(homeserverUrl, token, storage, cryptoProvider);
  global.client = client;
  AutojoinRoomsMixin.setupOnClient(client);

  // Before we start the bot, register our command handler
  initHandler(client);

  // Now that everything is set up, start the bot. This will start the sync loop and run until killed.
  client.start().then(() => console.log("Bot started!"));

  return client
}