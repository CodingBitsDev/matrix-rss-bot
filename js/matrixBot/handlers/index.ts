import { MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { handleLLamaMessage } from "./handleLLamaMessage";
import { handleDecryptionErrors } from "./handleDecryptionErrors";
import { MatrixBot } from "../matrixBot";

export function initHandler(client: MatrixBot){
  client.on("room.message", (roomId: string, event: MessageEvent<any>) => handleLLamaMessage(client, roomId, event));
  client.on("room.failed_decryption", (roomId: string, event: any, error: Error) => handleDecryptionErrors(client, roomId, event, error))
}