import { MatrixClient, MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { handleLLamaMessage } from "./handleLLamaMessage";

export function initHandler(client: MatrixClient){
  client.on("room.message", (roomId: string, event: MessageEvent<any>) => handleLLamaMessage(client, roomId, event));
}