import { MatrixClient, MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { handleLLamaMessage } from "./handleLLamaMessage";
import { handleDecryptionErrors } from "./handleDecryptionErrors";

export function initHandler(client: MatrixClient){
  client.on("room.message", (roomId: string, event: MessageEvent<any>) => handleLLamaMessage(client, roomId, event));
  client.on("room.failed_decryption", (roomId: string, event: any, error: Error) => handleDecryptionErrors(client, roomId, event, error))
}