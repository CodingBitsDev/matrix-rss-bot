import { MatrixAuth, MatrixClient, AutojoinRoomsMixin, SimpleFsStorageProvider, RustSdkCryptoStorageProvider } from "matrix-bot-sdk";
import { initHandler } from "./handlers/index";
import { config } from "dotenv";
config();

// This will be the URL where clients can reach your homeserver. Note that this might be different
// from where the web/chat interface is hosted. The server must support password registration without
// captcha or terms of service (public servers typically won't work).
const homeserverUrl = process.env.HOST_SERVER;

// const client = await auth.passwordLogin("renji-bot", "password");
const token = process.env.ACCESS_TOKEN;

const storage = new SimpleFsStorageProvider("gpn-bot.json");
const cryptoProvider = new RustSdkCryptoStorageProvider("gpn-bot-crypto");

const client = new MatrixClient(homeserverUrl, token, storage, cryptoProvider);
AutojoinRoomsMixin.setupOnClient(client);

// Before we start the bot, register our command handler
initHandler(client);
// client.on("room.message", (roomId) => handleCommand);

// Now that everything is set up, start the bot. This will start the sync loop and run until killed.
client.start().then(() => console.log("Bot started!"));

// This is the command handler we registered a few lines up

// async function handleCommand(roomId, event) {
//   console.log("### received", roomId, event);
//     // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
//     if (event['content']?.['msgtype'] !== 'm.text') return;
//     if (event['sender'] === await client.getUserId()) return;
    
//     // Check to ensure that the `!hello` command is being run
//     const body = event['content']['body'];
//     if (!body?.startsWith("!hello")) return;
    
//     // Now that we've passed all the checks, we can actually act upon the command
//     await client.replyNotice(roomId, event, "Hello world!");
// }

